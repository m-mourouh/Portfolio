export default async function getAllSkills() {
    try {
        const response = await fetch(process.env.LOCAL_URL + '/api/skills')
        const data = await response.json()
        return data
    } catch (err) {
        console.log(err)
    }
}
