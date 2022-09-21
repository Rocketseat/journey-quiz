import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import type { AppType } from 'next/dist/shared/lib/utils'
import superjson from 'superjson'
import type { AppRouter } from '../server/router'
import '../styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div id="portal-root">
      <Component {...pageProps} />
    </div>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({ url }),
      ],
      url,
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: { staleTime: Infinity },
        },
      },
    }
  },
  ssr: false,
})(MyApp)
