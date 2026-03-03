import { createFileRoute } from '@tanstack/react-router'
import { AuthView } from '@daveyplate/better-auth-ui'

export const Route = createFileRoute('/auth/$path')({
    component: AuthPage,
})

function AuthPage() {
    const { path } = Route.useParams()
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <AuthView pathname={path} />
        </div>
    )
}
