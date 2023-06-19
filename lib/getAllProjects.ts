export default async function getAllProjects() {
    const response = await fetch('/api/projects')
    const data = await response.json()
    return data
}