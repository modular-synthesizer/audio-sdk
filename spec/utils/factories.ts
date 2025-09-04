import { factory } from "@factory-js/factory";

export type ObjectFactory<T> = { [k in keyof T]: () => T[k] }

type Overrides<T> = Record<keyof T, () => unknown>

export function createFactory<T>(props: ObjectFactory<T>) {
  const mainFactory = factory.define({ props, vars: {} })
  return async (values: Partial<T> = {}) => {
    const entries = Object.entries(values).map(([ k, v ]) => [ k, () => v])
    const overrides: Overrides<T> = Object.fromEntries(entries)
    return (await mainFactory.props(overrides).build()) as T
  }
}