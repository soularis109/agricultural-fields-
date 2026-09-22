import { useParams } from 'react-router-dom'
import { getFieldById } from '../data/fields'
import type { Field } from '../types'

/**
 * The active field lives only in the URL — there is no fieldsStore.
 * Fields are static mock data, so `undefined` here means "unknown fieldId",
 * a valid domain state the caller renders as <FieldNotFound />, not an error.
 */
export function useActiveField(): Field | undefined {
  const { fieldId } = useParams<{ fieldId: string }>()
  return fieldId ? getFieldById(fieldId) : undefined
}
