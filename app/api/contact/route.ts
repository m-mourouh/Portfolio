import { NextResponse } from 'next/server'
import { transporter, mailOptions } from '@/config/nodemailer'

export async function POST(request: Request) {
    const res = await request.json()
    // send email
    try {
        const sendMail = await transporter.sendMail({
            ...mailOptions,
            subject: "Portfolio's Message",
            text: res.message,
            html: `
         <p><b style="color:#9400FF;">Email: </b><i>${res.email}</i></p>
         <p><b style="color:#9400FF;">FullName: </b> ${res.firstName} ${res.lastName}</p>
         <p><b style="color:#9400FF;">Message: </b>${res.message}</p>
         `,
        })
        if (sendMail) {
            return NextResponse.json({sent: true})
        }
    } catch (err) {
        console.log('Error sending meail', err)
    }
    return NextResponse.json({ sent: false })
}
