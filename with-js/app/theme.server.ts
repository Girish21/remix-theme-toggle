import { createCookieSessionStorage } from 'remix'

if (!process.env.COOKIE_SECRET) {
  throw new Error('process.env.COOKIE_SECRET should be defined')
}

const { commitSession, getSession } = createCookieSessionStorage({
  cookie: {
    name: '__theme',
    sameSite: 'lax',
    path: '/',
    secrets: [process.env.COOKIE_SECRET!],
  },
})

export { commitSession, getSession }
