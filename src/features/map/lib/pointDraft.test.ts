import { describe, expect, it } from 'vitest'
import { draftForField, type PointDraft } from './pointDraft'

const draft: PointDraft = { fieldId: 'field-1', point: { lat: 50.455, lng: 30.528 } }

describe('draftForField', () => {
  it('returns the point when the draft belongs to the given field', () => {
    expect(draftForField(draft, 'field-1')).toEqual(draft.point)
  })

  it('returns null when the draft belongs to a different field', () => {
    expect(draftForField(draft, 'field-2')).toBeNull()
  })

  it('returns null when there is no draft', () => {
    expect(draftForField(null, 'field-1')).toBeNull()
  })

  it('returns null when fieldId is undefined', () => {
    expect(draftForField(draft, undefined)).toBeNull()
  })
})