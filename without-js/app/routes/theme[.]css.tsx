import type { LoaderFunction } from 'remix'
import { DarkTheme, Theme } from '~/theme'
import { getSession } from '~/theme.server'
import { LightTheme } from '~/theme'

const themes: Record<string, Theme> = {
  light: LightTheme,
  dark: DarkTheme,
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const prefersColorScheme = session.get('theme') ?? 'light'

  const theme = themes[prefersColorScheme]

  const properties = Object.entries(theme).map(
    ([key, color]) => `--color-${key}:${color}`
  )
  const css = `:root{${properties.join(';')}}`

  return new Response(css, { headers: { 'Content-Type': 'text/css' } })
}
