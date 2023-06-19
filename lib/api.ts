import { EmailType } from '@/types/types'

export const sendContactForm = async (data: EmailType) => {
    let isSent = false;
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        const apiResponse = await response.json()
        isSent =  apiResponse.sent
    } catch (error) {
        console.log('Error: ', error)
    }
    return isSent
}
