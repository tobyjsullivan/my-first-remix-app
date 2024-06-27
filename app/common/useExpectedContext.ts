import { Context, useContext } from 'react'

export default function useExpectedContext<T>(ctx: Context<T | undefined>): T {
  const result = useContext(ctx)
  if (result === undefined) {
    throw new Error(`Context is unexpectedly empty.`)
  }

  return result
}
