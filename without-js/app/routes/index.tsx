import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from 'remix'
import { Form, json, redirect, useLoaderData } from 'remix'

import moonIcon from '~/svg/moon.svg'
import bulbIcon from '~/svg/bulb.svg'
import { commitSession, getSession } from '~/theme.server'

type LoaderData = {
  theme: 'light' | 'dark'
}

export const meta: MetaFunction = () => {
  return {
    title: 'Theme Toggle',
    description: 'Theme toggle implemented without JS',
  }
}

export const links: LinksFunction = () => {
  return [
    { rel: 'preload', href: moonIcon, as: 'image', type: 'image/svg+xml' },
    { rel: 'preload', href: bulbIcon, as: 'image', type: 'image/svg+xml' },
  ]
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))

  const theme = session.get('theme')

  if (!theme) {
    session.set('theme', 'dark')
  } else {
    if (theme === 'light') {
      session.set('theme', 'dark')
    } else {
      session.set('theme', 'light')
    }
  }

  return redirect('/', {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))

  const theme = session.get('theme')

  const data: LoaderData = { theme }

  return json(data, {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}

export default function App() {
  const data = useLoaderData<LoaderData>()

  return (
    <main>
      <Form reloadDocument method='post' action='?index'>
        <button aria-label='toggle theme'>
          <svg aria-hidden>
            {!data.theme ? (
              <use href={`${moonIcon}#moon`} />
            ) : data.theme === 'light' ? (
              <use href={`${moonIcon}#moon`} />
            ) : (
              <use href={`${bulbIcon}#bulb`} />
            )}
          </svg>
        </button>
      </Form>
      <p>Switch Theme</p>
    </main>
  )
}
