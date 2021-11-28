import type { ActionFunction } from 'remix'
import { json } from 'remix'
import { commitSession, getSession } from '~/theme.server'

export const action: ActionFunction = async ({ request }) => {
  const [session, formData] = await Promise.all([
    getSession(request.headers.get('Cookie')),
    request.formData(),
  ])

  const theme = formData.get('theme')

  session.set('theme', theme)

  return json(
    { theme },
    {
      headers: { 'Set-Cookie': await commitSession(session) },
    }
  )
}
