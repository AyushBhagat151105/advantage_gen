import { Link } from '@tanstack/react-router'
import { UserButton } from '@daveyplate/better-auth-ui'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) backdrop-blur-md">
      <nav className="page-wrap flex items-center justify-between py-3">

        {/* Left: Logo / Brand */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-4 py-2 text-sm font-semibold text-(--sea-ink) no-underline"
        >
          <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
          Advantage Gen
        </Link>

        {/* Center: Navigation links */}
        <div className="hidden sm:flex gap-8 text-sm font-semibold">
          <Link to="/" className="nav-link" activeProps={{ className: "nav-link is-active" }}>
            Home
          </Link>
          <Link to="/generate" className="nav-link" activeProps={{ className: "nav-link is-active" }}>
            Generate
          </Link>
        </div>

        {/* Right: Theme toggle + user */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton />
        </div>

      </nav>
    </header>
  )
}