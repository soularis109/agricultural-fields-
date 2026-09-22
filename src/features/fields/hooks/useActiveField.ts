import { useParams } from 'react-router-dom'
import { getFieldById } from '../data/fields'
import type { Field } from '../types'

export function useActiveField(): Field | undefined {
  const { fieldId } = useParams<{ fieldId: string }>()
  return fieldId ? getFieldById(fieldId) : undefined
}
