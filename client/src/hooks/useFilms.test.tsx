import { expect, test, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import api from '../api'
import useFilms from './useFilms'

const auth = vi.hoisted(() => ({ token: 'user-token' as string | null }))

vi.mock('../api', () => ({ default: { get: vi.fn() } }))
vi.mock('../context', () => ({ useApp: () => ({ state: { authToken: auth.token } }) }))

const get = vi.mocked(api.get)

test('a poll still in flight at logout does not bring the films back', async () => {
  auth.token = 'user-token'
  get.mockResolvedValueOnce({ data: { films: [] } })
  const { result, rerender } = renderHook(() => useFilms())
  await waitFor(() => expect(result.current[0].isLoading).toBe(false))

  // The poll starts while logged in, and its response arrives after logout.
  let resolvePoll!: (value: unknown) => void
  get.mockReturnValueOnce(new Promise((resolve) => { resolvePoll = resolve }))
  let poll!: Promise<void>
  act(() => { poll = result.current[1]() })

  get.mockResolvedValue({ data: { films: [] } })
  auth.token = null
  rerender()

  await act(async () => {
    resolvePoll({ data: { films: [{ _id: '1', title: 'Leaked film' }] } })
    await poll
  })
  await waitFor(() => expect(result.current[0].isLoading).toBe(false))
  expect(result.current[0].data).toEqual([])
})
