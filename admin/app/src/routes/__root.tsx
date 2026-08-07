import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { Toaster } from "@/components/ui/sonner"

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from "@tanstack/react-query";
import { getOrCreateQueryClient } from "@/lib/query-client";
import { PageAIContextProvider } from "@btst/stack/plugins/ai-chat/client/context";

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
    const queryClient = getOrCreateQueryClient()
  return (
    	<PageAIContextProvider>
    		<QueryClientProvider client={queryClient}>
        			<html lang="en">
              <head>
                <HeadContent />
              </head>
              <body>
                {children}
                <TanStackDevtools
                  config={{
                    position: 'bottom-right',
                  }}
                  plugins={[
                    {
                      name: 'Tanstack Router',
                      render: <TanStackRouterDevtoolsPanel />,
                    },
                    TanStackQueryDevtools,
                  ]}
                />

                <Toaster
                  richColors
                  closeButton
                  position="top-right"
                />

                <Scripts />
              </body>
            </html>
        		</QueryClientProvider>
    	</PageAIContextProvider>
    )
}
