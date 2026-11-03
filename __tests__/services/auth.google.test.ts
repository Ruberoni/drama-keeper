const mockVerifyIdToken = jest.fn()

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({ verifyIdToken: mockVerifyIdToken })),
}))

jest.mock('../../models/User', () => ({
  __esModule: true,
  default: { findOneAndUpdate: jest.fn() },
}))

import jwt from 'jsonwebtoken'
import UserModel from '../../models/User'
import { googleLogin, verifyGoogleIdToken } from '../../services/Auth'

const ticket = (payload: object | undefined) => ({ getPayload: () => payload })

beforeEach(() => {
  jest.clearAllMocks()
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
  test('upserts the user (returning the new doc) and signs a JWT', async () => {
    mockVerifyIdToken.mockResolvedValue(
      ticket({ sub: '123', email: 'a@b.com', email_verified: true })
    )
    ;(UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: 'user-id' })

    const token = await googleLogin('cred')

    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { $or: [{ googleId: '123' }, { email: 'a@b.com' }] },
      { googleId: '123', email: 'a@b.com' },
      { upsert: true, new: true }
    )
    expect((jwt.verify(token, 'test-key') as { _id: string })._id).toBe('user-id')
  })
})
