import { Links, Meta, Outlet, Scripts } from '@remix-run/react'

import './reset.scss'
import { Editor } from './Editor'

export default function App() {
  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body>
        <Editor />
        <Outlet />

        <Scripts />
      </body>
    </html>
  )
}
