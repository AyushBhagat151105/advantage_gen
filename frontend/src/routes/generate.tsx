import { createFileRoute, redirect } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Wand2, Loader2, ImageOff, Download, Sparkles } from 'lucide-react'
import { authClient } from '#/lib/auth-client'
import { generateImage, type GenerateImageData } from '#/lib/api'

// ─── Auth Guard ───────────────────────────────────────────────────────────────

export const Route = createFileRoute('/generate')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession()
    if (!session?.user) {
      throw redirect({ to: '/auth/$path', params: { path: 'sign-in' } })
    }
  },
  component: GeneratePage,
})

// ─── Component ────────────────────────────────────────────────────────────────

function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<GenerateImageData | null>(null)

  const mutation = useMutation({
    mutationFn: () => generateImage({ prompt }),
    onSuccess: (data) => {
      setResult(data.data)
      toast.success('Image generated successfully!')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to generate image. Please try again.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first.')
      return
    }
    mutation.mutate()
  }

  const handleDownload = () => {
    if (!result?.image?.url) return
    const link = document.createElement('a')
    link.href = result.image.url
    link.download = result.image.fileName ?? 'generated-image.png'
    link.click()
  }

  return (
    <main className="page-wrap py-12">
      {/* Header */}
      <section className="rise-in mb-10 text-center">
        <span className="island-kicker mb-4 inline-block">AI Studio</span>
        <h1 className="display-title mb-4 text-4xl font-bold text-(--) sm:text-5xl">
          Generate your{' '}
          <span className="bg-[linear-gradient(135deg,var(--lagoon),var(--palm))] bg-clip-text text-transparent">
            ad creative
          </span>
        </h1>
        <p className="mx-auto max-w-lg text-base text-(--)">
          Describe your brand, product, or campaign — our AI will craft a
          professional advertising poster for you.
        </p>
      </section>

      <div className="mx-auto max-w-2xl">
        {/* Prompt form */}
        <form
          onSubmit={handleSubmit}
          className="island-shell rise-in mb-8 rounded-2xl p-6"
          style={{ animationDelay: '80ms' }}
        >
          <label
            htmlFor="prompt"
            className="mb-2 block text-sm font-semibold text-(--)"
          >
            Describe your campaign
          </label>
          <textarea
            id="prompt"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={mutation.isPending}
            placeholder={`e.g. "Create a complete advertising caption and poster-style description for a new footwear brand called StepUp"`}
            className="w-full resize-none rounded-xl border border-(--) bg-(--) px-4 py-3 text-sm text-(--) placeholder:text-(--) focus:border-(--) focus:outline-none focus:ring-2 focus:ring-[rgba(50,143,151,0.2)] transition disabled:opacity-60"
          />
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-xs text-(--)">
              {prompt.length} / 1000 characters
            </p>
            <button
              type="submit"
              disabled={mutation.isPending || !prompt.trim()}
              className="inline-flex items-center gap-2 rounded-full text-black dark:text-white bg-(--) px-6 py-2.5 text-sm font-semibol shadow-lg shadow-[rgba(50,143,151,0.3)] transition hover:scale-105 hover:shadow-xl hover:shadow-[rgba(50,143,151,0.4)] active:scale-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black dark:text-white" />
                  Generating…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 text-black dark:text-white" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading state */}
        {mutation.isPending && (
          <div className="island-shell rise-in flex flex-col items-center justify-center gap-4 rounded-2xl p-16 text-center">
            <div className="relative">
              <div className="h-14 w-14 rounded-full border-4 border-(--) border-t-(--) animate-spin" />
              <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-(--)" />
            </div>
            <div>
              <p className="font-semibold text-(--)">Crafting your creative…</p>
              <p className="mt-1 text-sm text-(--)">
                This usually takes 15–30 seconds
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {mutation.isError && !mutation.isPending && (
          <div className="island-shell rise-in flex flex-col items-center gap-3 rounded-2xl border-red-200/60 p-10 text-center">
            <ImageOff className="h-10 w-10 text-red-400" />
            <p className="font-semibold text-(--)">Generation failed</p>
            <p className="text-sm text-(--)">
              {(mutation.error as Error)?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => mutation.mutate()}
              className="mt-2 rounded-full border border-(--) bg-(--) px-5 py-2 text-sm font-medium text-(--) transition hover:bg-(--)"
            >
              Try again
            </button>
          </div>
        )}

        {/* Result */}
        {result && !mutation.isPending && (
          <div className="island-shell rise-in rounded-2xl overflow-hidden">
            {/* Image */}
            <div className="relative w-full bg-(--) flex items-center justify-center p-4 rounded-xl overflow-hidden">
              <img
                src={result.image.url}
                alt={result.image.prompt}
                className="max-h-[600px] w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>

            {/* Metadata + actions */}
            <div className="p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-(--) bg-(--) px-3 py-1 text-xs font-medium text-(--)">
                  Model: {result.image.model}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-(--) bg-(--) px-3 py-1 text-xs font-medium text-(--)">
                  {result.image.fileName}
                </span>
              </div>
              <p className="mb-5 text-sm text-(--) leading-relaxed line-clamp-3">
                {result.image.prompt}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-full bg-(--) px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:scale-105 hover:shadow-lg active:scale-100"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    setResult(null)
                    setPrompt('')
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-(--) bg-(--) px-5 py-2.5 text-sm font-semibold text-(--) transition hover:bg-(--)"
                >
                  <Wand2 className="h-4 w-4" />
                  New creative
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
