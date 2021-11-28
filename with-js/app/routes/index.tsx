import type { LinksFunction, MetaFunction } from 'remix'

import moonIcon from '~/svg/moon.svg'
import bulbIcon from '~/svg/bulb.svg'
import { Theme, useTheme } from '~/theme'

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

export default function App() {
  const [theme, setTheme] = useTheme()

  return (
    <main>
      <button
        aria-label='toggle theme'
        onClick={() =>
          setTheme((previosTheme) =>
            previosTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK
          )
        }
      >
        <svg aria-hidden>
          {!theme ? null : theme === 'light' ? (
            <use href={`${moonIcon}#moon`} />
          ) : (
            <use href={`${bulbIcon}#bulb`} />
          )}
        </svg>
      </button>
      <p>Switch Theme</p>
    </main>
  )
}
