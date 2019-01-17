import { types } from '../../../ymir-codegen/src/libs/types'

export const typeNameData = []

Object.keys(types).forEach((p) => {
  const type = {
    value: p,
    label: p,
    children: [],
  }
  Object.keys(types[p]).forEach((s) => {
    if (s !== 'default') {
      const child = {
        value: s,
        label: s,
      }
      type.children.push(child)
    }
  })
  typeNameData.push(type)
})
