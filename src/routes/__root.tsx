import { createRootRoute, Outlet } from '@tanstack/react-router'
export const Route = createRootRoute({
  component: () => (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`.font-serif{font-family:'Instrument Serif',serif} body{margin:0;background:#08110B;font-family:'JetBrains Mono',monospace}`}</style>
      <Outlet />
    </>
  ),
})
