import { describe, expect, it } from 'vitest'
import { isPointType, POINT_TYPES } from './pointTypes'
import { isSortOrder, SORT_ORDERS } from './points'

describe('isPointType', () => {
  it.each(POINT_TYPES)('accepts %s as a valid point type', (type) => {
    expect(isPointType(type)).toBe(true)
  })

  it('rejects an unknown value', () => {
    expect(isPointType('unknown')).toBe(false)
  })
})

describe('isSortOrder', () => {
  it.each(SORT_ORDERS)('accepts %s as a valid sort order', (order) => {
    expect(isSortOrder(order)).toBe(true)
  })

  it('rejects an unknown value', () => {
    expect(isSortOrder('unknown')).toBe(false)
  })
})