import axios from 'axios'
import { authClient } from './auth-client'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Important: sends auth cookies cross-domain
    headers: {
        'Content-Type': 'application/json',
    },
})

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GenerateImageRequest {
    prompt: string
}

export interface GenerateImageData {
    image: {
        filePath: string
        fileName: string
        prompt: string
        model: string
    }
}

export interface ApiResponse<T = Record<string, unknown>> {
    success: boolean
    statusCode: number
    message: string
    data: T
    timestamp: string
}

// ─── API Functions ───────────────────────────────────────────────────────────

export async function generateImage(body: GenerateImageRequest): Promise<ApiResponse<GenerateImageData>> {
    const { data } = await apiClient.post<ApiResponse<GenerateImageData>>('/api/generate/image', body)
    return data
}
