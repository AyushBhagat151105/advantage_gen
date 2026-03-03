import { createFileRoute } from '@tanstack/react-router'
import { AccountView } from '@daveyplate/better-auth-ui'

export const Route = createFileRoute('/account/$path')({
  component: AccountPage,
})

function AccountPage() {
  const { path } = Route.useParams()
  return (
    <div className="page-wrap py-10">
      <AccountView pathname={path} />
    </div>
  )
}
