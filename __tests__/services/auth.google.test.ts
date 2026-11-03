import type { Mock } from 'vitest'

const { mockVerifyIdToken } = vi.hoisted(() => ({ mockVerifyIdToken: vi.fn() }))

vi.mock('google-auth-library', () => ({
  OAuth2Client: vi.fn(function () {
    return { verifyIdToken: mockVerifyIdToken }
  }),
}))

vi.mock('../../models/User', () => ({
  default: { findOneAndUpdate: vi.fn() },
}))

import jwt from 'jsonwebtoken'
import UserModel from '../../models/User'
import { googleLogin, verifyGoogleIdToken } from '../../services/Auth'

const ticket = (payload: object | undefined) => ({ getPayload: () => payload })

beforeEach(() => {
  vi.clearAllMocks()
  process.env.GOOGLE_CLIENT_ID = 'client-id'
  process.env.tokenKey = 'test-key'
})

describe('verifyGoogleIdToken', () => {
  test('verifies against GOOGLE_CLIENT_ID and returns the profile', async () => {
    mockVerifyIdToken.mockResolvedValue(
      ticket({ sub: '123', email: 'a@b.com', email_verified: true })
    )
    await expect(verifyGoogleIdToken('cred')).resolves.toEqual({
      googleId: '123',
      email: 'a@b.com',
    })
    expect(mockVerifyIdToken).toHaveBeenCalledWith({ idToken: 'cred', audience: 'client-id' })
  })

  test('rejects a missing credential without calling Google', async () => {
    await expect(verifyGoogleIdToken('')).rejects.toThrow('missing credential')
    expect(mockVerifyIdToken).not.toHaveBeenCalled()
  })

  test('rejects an unverified email', async () => {
    mockVerifyIdToken.mockResolvedValue(
      ticket({ sub: '123', email: 'a@b.com', email_verified: false })
    )
    await expect(verifyGoogleIdToken('cred')).rejects.toThrow('not verified')
  })

  test('propagates verification failures', async () => {
    mockVerifyIdToken.mockRejectedValue(new Error('Wrong recipient'))
    await expect(verifyGoogleIdToken('cred')).rejects.toThrow('Wrong recipient')
  })
})

describe('googleLogin', () => {
  test('rejects when GOOGLE_CLIENT_ID is not configured', async () => {
    delete process.env.GOOGLE_CLIENT_ID
    await expect(verifyGoogleIdToken('cred')).rejects.toThrow('not configured')
    expect(mockVerifyIdToken).not.toHaveBeenCalled()
  })

  test('signs a JWT for an existing Google user', async () => {
    verifyIdToken_ok()
    ;(UserModel.findOneAndUpdate as Mock).mockResolvedValueOnce({ _id: 'user-id' })
    const token = await googleLogin('cred')
    expect(UserModel.findOneAndUpdate).toHaveBeenCalledTimes(1)
    expect((jwt.verify(token, 'test-key') as { _id: string })._id).toBe('user-id')
  })

  test('links or creates by lowercased email when googleId is unknown', async () => {
    mockVerifyIdToken.mockResolvedValue(
      ticket({ sub: '123', email: 'A@B.com', email_verified: true })
    )
    ;(UserModel.findOneAndUpdate as Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ _id: 'new-id' })
    const token = await googleLogin('cred')
    expect(UserModel.findOneAndUpdate).toHaveBeenLastCalledWith(
      { email: 'a@b.com' },
      { $set: { googleId: '123' }, $setOnInsert: { email: 'a@b.com' } },
      { upsert: true, new: true }
    )
    expect((jwt.verify(token, 'test-key') as { _id: string })._id).toBe('new-id')
  })
})

function verifyIdToken_ok() {
  mockVerifyIdToken.mockResolvedValue(
    ticket({ sub: '123', email: 'a@b.com', email_verified: true })
  )
}
