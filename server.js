import { createRequestHandler } from '@remix-run/express'
import express from 'express'

import * as build from './build/server/index.js'

const PORT = 3000

const app = express()
app.use(express.static('build/client'))

app.all('*', createRequestHandler({ build }))

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
