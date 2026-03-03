import { AuthUIProvider } from '@daveyplate/better-auth-ui'
import { useNavigate, Link } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'

export function BetterAuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()

    return (
        <AuthUIProvider
            authClient={authClient}
            navigate={(href) => navigate({ to: href })}
            replace={(href) => navigate({ to: href, replace: true })}
            Link={({ href, ...props }) => <Link to={href} {...props} />}
        >
            {children}
        </AuthUIProvider>
    )
}
