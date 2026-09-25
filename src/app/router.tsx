import { createBrowserRouter, redirect } from 'react-router-dom'
import { getFirstField } from '@/features/fields'
import { AppShell } from './AppShell'
import { FieldView } from './FieldView'
import { RouteError } from './RouteError'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        loader: () => redirect(`/fields/${getFirstField().properties.id}`),
      },
      {
        path: 'fields/:fieldId',
        element: <FieldView />,
      },
    ],
  },
])
