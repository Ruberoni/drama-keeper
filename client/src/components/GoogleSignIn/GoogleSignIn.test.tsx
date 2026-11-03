import { expect, test, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import GoogleSignIn from './GoogleSignIn'

vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'test-client-id')

test('initialises GIS, renders the button and forwards the credential', async () => {
  let callback: (r: { credential: string }) => void = () => {}
  const initialize = vi.fn((config) => { callback = config.callback })
  const renderButton = vi.fn()
  window.google = { accounts: { id: { initialize, renderButton } } }
  const onCredential = vi.fn()

  const { getByTestId } = render(<GoogleSignIn onCredential={onCredential} />)

  await waitFor(() => expect(renderButton).toHaveBeenCalled())
  expect(initialize).toHaveBeenCalledWith(
    expect.objectContaining({ client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID }),
  )
  expect(renderButton.mock.calls[0][0]).toBe(getByTestId('google-signin'))

  callback({ credential: 'id-token' })
  expect(onCredential).toHaveBeenCalledWith('id-token')
})
