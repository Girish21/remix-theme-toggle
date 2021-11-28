import * as React from 'react'
import { useFetcher } from 'remix'

enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

type ThemeContextType = [
  theme: Theme | null | undefined,
  setThme: React.Dispatch<React.SetStateAction<Theme | null>>
]

type ThemeProviderType = {
  ssrTheme: string | null | undefined
}

const MediaQuery = '(prefers-color-scheme: dark)'

const getPreferedTheme = () =>
  window.matchMedia(MediaQuery).matches ? Theme.DARK : Theme.LIGHT

const ThemeContext = React.createContext<ThemeContextType | null>(null)

const useTheme = () => {
  const theme = React.useContext(ThemeContext)

  if (!theme) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return theme
}

const ThemeProvider: React.FunctionComponent<ThemeProviderType> = ({
  children,
  ssrTheme,
}) => {
  const fetcher = useFetcher()
  const [theme, setTheme] = React.useState(() => {
    if (ssrTheme) {
      if (Object.values(Theme).includes(ssrTheme as Theme)) {
        return ssrTheme as Theme
      }
      return null
    }

    if (typeof window === 'undefined') {
      return null
    }

    return getPreferedTheme()
  })

  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (!mounted.current || !theme) {
      mounted.current = true
      return
    }

    fetcher.submit({ theme: theme ?? '' }, { action: '/theme', method: 'post' })
  }, [theme])

  React.useEffect(() => {
    const media = window.matchMedia(MediaQuery)
    const handler = () => {
      setTheme(media.matches ? Theme.DARK : Theme.LIGHT)
    }
    media.addEventListener('change', handler)

    return () => media.removeEventListener('change', handler)
  }, [])

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}

const ClientThemeScript = `
  ;(() => {
    const dark = window.matchMedia(${JSON.stringify(MediaQuery)}).matches;
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (dark) {
      document.documentElement.classList.add('dark');
      meta.content = 'dark light';
    } else {
      meta.content = 'light dark';
    }
  })()
`

const SSRNoFlashTheme = ({
  ssrTheme,
}: {
  ssrTheme: string | undefined | null
}) => {
  return (
    <>
      <meta
        name='color-scheme'
        content={
          !ssrTheme || ssrTheme === Theme.DARK ? 'dark light' : 'light dark'
        }
        suppressHydrationWarning
      />
      {!ssrTheme && (
        <script dangerouslySetInnerHTML={{ __html: ClientThemeScript }} />
      )}
    </>
  )
}

export { getPreferedTheme, SSRNoFlashTheme, Theme, ThemeProvider, useTheme }
