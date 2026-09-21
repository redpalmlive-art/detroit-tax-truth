import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, HeadContent, Scripts } from '@tanstack/react-router'
// @ts-ignore
import appCss from '../styles.css?url'
import { SiteHeader } from '../components/SiteHeader'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        <QueryClientProvider client={queryClient}>
          <SiteHeader />
          <Outlet />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}