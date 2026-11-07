/**
 * Energetic generative background track (Web Audio, no audio file).
 * Synthwave / uplifting house at 122 BPM: kick, clap, hi-hats, octave bassline,
 * 16th-note arpeggio with echo, and side-chained ("pumping") chord pads.
 * Notes are scheduled ahead on the audio clock so timing stays tight.
 */

export const BPM = 122
const VOLUME = 0.2
const STEP = 60 / BPM / 4 // one 16th note, in seconds

// Am → F → C → G, one chord per bar
const CHORDS = [
    { bass: 45, notes: [57, 60, 64, 67] }, // A  C  E  G
    { bass: 41, notes: [53, 57, 60, 64] }, // F  A  C  E
    { bass: 48, notes: [55, 60, 64, 67] }, // C  (G C E G)
    { bass: 43, notes: [55, 59, 62, 67] }, // G  B  D  G
]
// Bass octave bounce over 8 eighth notes: 0 = root, 12 = octave up, 7 = fifth
const BASS_PATTERN = [0, 12, 0, 12, 0, 12, 7, 12]
// Arpeggio over 16 sixteenth notes: indexes into the chord tones (+4 = an octave higher)
const ARP_PATTERN = [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 4, 5, 6, 5, 4, 2]

const freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

export class MusicEngine {
    private ctx: AudioContext | null = null
    private master!: GainNode
    private bus!: DynamicsCompressorNode
    private padDuck!: GainNode
    private echo!: GainNode
    private reverb!: ConvolverNode
    private noise!: AudioBuffer
    private timer: ReturnType<typeof setInterval> | null = null
    private nextTime = 0
    private step = 0
    private playing = false
    private starting: Promise<boolean> | null = null

    get isPlaying() {
        return this.playing
    }

    // ---------- audio graph ----------

    private setup() {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new Ctx()
        this.ctx = ctx

        this.bus = ctx.createDynamicsCompressor()
        this.bus.threshold.value = -18
        this.bus.ratio.value = 4
        this.bus.attack.value = 0.005
        this.bus.release.value = 0.15
        this.master = ctx.createGain()
        this.master.gain.value = 0
        this.bus.connect(this.master).connect(ctx.destination)

        // short room reverb
        this.reverb = ctx.createConvolver()
        this.reverb.buffer = this.impulse(2.2, 3)
        const wet = ctx.createGain()
        wet.gain.value = 0.25
        this.reverb.connect(wet).connect(this.bus)

        // dotted-8th echo for the arpeggio
        this.echo = ctx.createGain()
        const delay = ctx.createDelay(1)
        delay.delayTime.value = STEP * 3
        const feedback = ctx.createGain()
        feedback.gain.value = 0.32
        const tone = ctx.createBiquadFilter()
        tone.type = 'lowpass'
        tone.frequency.value = 3000
        this.echo.connect(delay)
        delay.connect(tone).connect(feedback).connect(delay)
        const echoLevel = ctx.createGain()
        echoLevel.gain.value = 0.45
        tone.connect(echoLevel).connect(this.bus)

        // pads + bass duck on every kick (side-chain pump)
        this.padDuck = ctx.createGain()
        this.padDuck.connect(this.bus)
        this.padDuck.connect(this.reverb)

        this.noise = this.noiseBuffer(1)
    }

    private impulse(seconds: number, decay: number) {
        const ctx = this.ctx!
        const length = Math.floor(ctx.sampleRate * seconds)
        const buf = ctx.createBuffer(2, length, ctx.sampleRate)
        for (let ch = 0; ch < 2; ch++) {
            const d = buf.getChannelData(ch)
            for (let i = 0; i < length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
        }
        return buf
    }

    private noiseBuffer(seconds: number) {
        const ctx = this.ctx!
        const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
        return buf
    }

    // ---------- instruments ----------

    private kick(t: number) {
        const ctx = this.ctx!
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.frequency.setValueAtTime(150, t)
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.12)
        g.gain.setValueAtTime(0.9, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
        osc.connect(g).connect(this.bus)
        osc.start(t)
        osc.stop(t + 0.42)
        // side-chain: dip pads/bass, then swell back
        const d = this.padDuck.gain
        d.cancelScheduledValues(t)
        d.setValueAtTime(0.25, t)
        d.linearRampToValueAtTime(1, t + STEP * 3)
    }

    private noiseHit(t: number, opts: { type: BiquadFilterType; freq: number; q?: number; gain: number; decay: number; reverb?: boolean }) {
        const ctx = this.ctx!
        const src = ctx.createBufferSource()
        src.buffer = this.noise
        const f = ctx.createBiquadFilter()
        f.type = opts.type
        f.frequency.value = opts.freq
        if (opts.q) f.Q.value = opts.q
        const g = ctx.createGain()
        g.gain.setValueAtTime(opts.gain, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + opts.decay)
        src.connect(f).connect(g).connect(this.bus)
        if (opts.reverb) g.connect(this.reverb)
        src.start(t)
        src.stop(t + opts.decay + 0.02)
    }

    private clap(t: number, level = 1) {
        this.noiseHit(t, { type: 'bandpass', freq: 1700, q: 0.8, gain: 0.5 * level, decay: 0.2, reverb: true })
        this.noiseHit(t + 0.012, { type: 'bandpass', freq: 2400, q: 1.2, gain: 0.25 * level, decay: 0.12 })
    }

    private hat(t: number, open = false, level = 1) {
        this.noiseHit(t, { type: 'highpass', freq: 8000, gain: (open ? 0.12 : 0.08) * level, decay: open ? 0.22 : 0.045 })
    }

    private bass(t: number, midi: number) {
        const ctx = this.ctx!
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.value = freq(midi)
        const f = ctx.createBiquadFilter()
        f.type = 'lowpass'
        f.Q.value = 6
        f.frequency.setValueAtTime(1400, t)
        f.frequency.exponentialRampToValueAtTime(220, t + STEP * 1.6)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.0001, t)
        g.gain.linearRampToValueAtTime(0.22, t + 0.008)
        g.gain.exponentialRampToValueAtTime(0.001, t + STEP * 1.9)
        osc.connect(f).connect(g).connect(this.padDuck)
        osc.start(t)
        osc.stop(t + STEP * 2)
    }

    private arp(t: number, midi: number, level: number) {
        const ctx = this.ctx!
        const osc = ctx.createOscillator()
        osc.type = 'square'
        osc.frequency.value = freq(midi)
        const f = ctx.createBiquadFilter()
        f.type = 'lowpass'
        f.frequency.setValueAtTime(4200, t)
        f.frequency.exponentialRampToValueAtTime(900, t + 0.14)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.0001, t)
        g.gain.linearRampToValueAtTime(0.06 * level, t + 0.004)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.16)
        osc.connect(f).connect(g)
        g.connect(this.bus)
        g.connect(this.echo)
        osc.start(t)
        osc.stop(t + 0.18)
    }

    private pad(t: number, notes: number[], bars = 1) {
        const ctx = this.ctx!
        const length = STEP * 16 * bars
        const f = ctx.createBiquadFilter()
        f.type = 'lowpass'
        f.frequency.value = 1800
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.0001, t)
        g.gain.linearRampToValueAtTime(0.045, t + 0.05)
        g.gain.setValueAtTime(0.045, t + length - 0.08)
        g.gain.linearRampToValueAtTime(0.0001, t + length)
        f.connect(g).connect(this.padDuck)
        notes.forEach((n) =>
            [-9, 9].forEach((cents) => {
                const osc = ctx.createOscillator()
                osc.type = 'sawtooth'
                osc.frequency.value = freq(n)
                osc.detune.value = cents
                osc.connect(f)
                osc.start(t)
                osc.stop(t + length + 0.02)
            })
        )
    }

    // ---------- sequencer ----------

    private scheduleStep(step: number, t: number) {
        const bar = Math.floor(step / 16)
        const s = step % 16
        const chord = CHORDS[bar % CHORDS.length]
        const intro = bar < 4 // pads, arp and bass first, drums drop in at bar 5
        const phrase = bar % 16
        const breakdown = !intro && phrase >= 14 // 2-bar break with a snare build every 16 bars

        if (s === 0) this.pad(t, chord.notes)

        // bass: 8th notes, quieter during intro and breakdown
        if (s % 2 === 0 && !breakdown) this.bass(t, chord.bass + BASS_PATTERN[s / 2])

        // arpeggio: 16ths over the chord, an octave up on every other chord
        const tones = [...chord.notes, ...chord.notes.map((n) => n + 12)]
        const lift = bar % 2 === 1 ? 12 : 0
        this.arp(t, tones[ARP_PATTERN[s] % tones.length] + lift, intro ? 0.7 : 1)

        if (intro) return

        if (breakdown) {
            // snare build: 8ths, then 16ths in the last bar, getting louder
            const build = phrase === 15
            if (build || s % 4 === 0) this.clap(t, 0.35 + (build ? (s / 16) * 0.65 : 0.1))
            return
        }

        if (s % 4 === 0) this.kick(t)
        if (s === 4 || s === 12) this.clap(t)
        if (s % 4 === 2) this.hat(t, true)
        else this.hat(t, false, s % 2 === 0 ? 1 : 0.6)
    }

    private tick = () => {
        const ctx = this.ctx
        if (!ctx) return
        // schedule everything due in the next 120 ms
        while (this.nextTime < ctx.currentTime + 0.12) {
            this.scheduleStep(this.step, this.nextTime)
            this.nextTime += STEP
            this.step++
        }
    }

    // ---------- controls ----------

    /** Starts the music. Returns false if the browser doesn't allow sound yet. */
    start(): Promise<boolean> {
        if (this.playing) return Promise.resolve(true)
        // several events from one click can call start() at once: share the same attempt
        this.starting = this.starting || this.doStart().finally(() => (this.starting = null))
        return this.starting
    }

    private async doStart(): Promise<boolean> {
        if (this.playing) return true
        if (!this.ctx) this.setup()
        const ctx = this.ctx!
        if (ctx.state !== 'running') {
            // when sound isn't allowed yet, resume() never settles: don't wait for it
            await Promise.race([ctx.resume().catch(() => undefined), new Promise((r) => setTimeout(r, 300))])
        }
        if (ctx.state !== 'running') return false

        this.playing = true
        const now = ctx.currentTime
        this.master.gain.cancelScheduledValues(now)
        this.master.gain.setValueAtTime(this.master.gain.value, now)
        this.master.gain.linearRampToValueAtTime(VOLUME, now + 1.5)
        this.nextTime = now + 0.08
        this.timer = setInterval(this.tick, 25)
        this.tick()
        return true
    }

    stop() {
        if (!this.playing || !this.ctx) return
        this.playing = false
        if (this.timer) clearInterval(this.timer)
        const ctx = this.ctx
        const now = ctx.currentTime
        this.master.gain.cancelScheduledValues(now)
        this.master.gain.setValueAtTime(this.master.gain.value, now)
        this.master.gain.linearRampToValueAtTime(0, now + 0.8)
        // fully pause the audio engine after the fade, so it uses no CPU
        setTimeout(() => {
            if (!this.playing) ctx.suspend()
        }, 1000)
    }
}
