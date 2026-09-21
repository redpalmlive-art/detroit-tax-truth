import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, HeadContent, Scripts } from '@tanstack/react-router'
// @ts-ignore
import appCss from '../styles.css?url'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  notFoundComponent: () => <div style={{padding:20}}>Not Found - rebuilding...</div>,
  component: RootComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}