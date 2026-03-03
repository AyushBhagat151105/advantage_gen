import axios from 'axios'
import { authClient } from './auth-client'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Attach auth token to every request
apiClient.interceptors.request.use(async (config) => {
    const { data: session } = await authClient.getSession()
    if (session?.session?.token) {
        config.headers['Authorization'] = `Bearer ${session.session.token}`
    }
    return config
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
