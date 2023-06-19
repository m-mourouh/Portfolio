import { ProjectType } from "@/types/types"

export function splitArray<T>(arr: T[] , chunkSize: number) {
    let result = []

    for (let i = 0; i < arr.length; i += chunkSize) {
        let chunk = arr.slice(i, i + chunkSize)
        result.push(chunk)
    }

    return result
}

export function isObjEmpty(obj: object) {
    return Object.keys(obj).length === 0
}
