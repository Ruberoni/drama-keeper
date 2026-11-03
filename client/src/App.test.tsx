import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { red } from '@mui/material/colors'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import App from './App'
import { AppProvider } from './context'

vi.mock('./api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { films: [] } }),
    post: vi.fn(),
  },
}))

const theme = createTheme({ palette: { primary: red } })

test('renders the film lists', async () => {
  render(
    <ThemeProvider theme={theme}>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>,
  )
  expect(await screen.findByText('To see')).toBeInTheDocument()
  expect(screen.getByText('Seen')).toBeInTheDocument()
})
