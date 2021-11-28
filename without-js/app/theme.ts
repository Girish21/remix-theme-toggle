type Theme = {
  background: string
  foreground: string
  text: string
}

const LightTheme: Theme = {
  background: '0deg 0% 100%',
  foreground: '0deg 0% 95%',
  text: '0deg 0% 15%',
}

const DarkTheme: Theme = {
  background: '0deg 0% 15%',
  foreground: '0deg 0% 25%',
  text: '0deg 0% 90%',
}

export type { Theme }
export { DarkTheme, LightTheme }
