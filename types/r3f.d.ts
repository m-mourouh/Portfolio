// R3F v8 registers its elements on the global JSX namespace, but @types/react 19
// reads React.JSX. Bridge the two so <mesh>, <shaderMaterial>, ... typecheck.
import type { ThreeElements } from '@react-three/fiber'

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements {}
    }
}
