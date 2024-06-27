import { Context, createContext } from 'react'

export default function createExpectedContext<T>(): Context<T | undefined> {
  return createContext<T | undefined>(undefined)
}
