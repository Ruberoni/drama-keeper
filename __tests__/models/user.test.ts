import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import type { Request, Response } from "express";
import connectDb from "../../config/db";
import UserModel from "../../models/User";
import { googleLogin, login } from "../../services/Auth";
import { authorize } from "../../middlewares/Auth";

// Runs against the test DB so the Mongoose 9 save hook and upserts are exercised for real.
// Only Google's token verification is mocked.
const googleProfile = (sub: string, email: string) => ({
  getPayload: () => ({ sub, email, email_verified: true }),
});

const userIdFromToken = (token: string) =>
  (jwt.verify(token, process.env.tokenKey as string) as { _id: string })._id;

beforeAll(async () => {
  process.env.tokenKey ??= "test-key";
  process.env.GOOGLE_CLIENT_ID ??= "test-client-id";
  await connectDb();
  await UserModel.init(); // build the unique email index before the upsert tests
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  vi.restoreAllMocks();
  await UserModel.deleteMany({});
});

describe("User model", () => {
  test("hashes the password exactly once across two saves", async () => {
    const user = await UserModel.create({
      email: "a@b.com",
      password: "secret123",
    });
    const firstHash = user.password;
    expect(firstHash).not.toBe("secret123");

    user.googleId = "g-1";
    await user.save();

    const stored = await UserModel.findById(user._id).orFail();
    expect(stored.password).toBe(firstHash);
    expect(await bcrypt.compare("secret123", stored.password as string)).toBe(
      true,
    );
    expect(await stored.verifyPassword("secret123")).toBe(true);
    expect(await stored.verifyPassword("wrong-pass")).toBe(false);
  });

  test("re-hashes when the password changes", async () => {
    const user = await UserModel.create({
      email: "a@b.com",
      password: "secret123",
    });
    user.password = "another456";
    await user.save();
    const stored = await UserModel.findById(user._id).orFail();
    expect(await stored.verifyPassword("another456")).toBe(true);
    expect(await stored.verifyPassword("secret123")).toBe(false);
  });
});

describe("googleLogin against the database", () => {
  test("creates a user on first login", async () => {
    vi.spyOn(OAuth2Client.prototype, "verifyIdToken").mockResolvedValue(
      googleProfile("g-new", "New@Example.com") as never,
    );
    const token = await googleLogin("cred");

    const user = await UserModel.findById(userIdFromToken(token)).orFail();
    expect(user.email).toBe("new@example.com");
    expect(user.googleId).toBe("g-new");
    expect(user.password).toBeUndefined();

    // A second login finds the same user by Google id.
    const again = await googleLogin("cred");
    expect(userIdFromToken(again)).toBe(user._id.toString());
    expect(await UserModel.countDocuments()).toBe(1);
  });

  test("links an existing email account and keeps password login working", async () => {
    const existing = await UserModel.create({
      email: "a@b.com",
      password: "secret123",
    });
    vi.spyOn(OAuth2Client.prototype, "verifyIdToken").mockResolvedValue(
      googleProfile("g-link", "A@B.com") as never,
    );

    const token = await googleLogin("cred");
    expect(userIdFromToken(token)).toBe(existing._id.toString());

    const linked = await UserModel.findById(existing._id).orFail();
    expect(linked.googleId).toBe("g-link");
    expect(await UserModel.countDocuments()).toBe(1);

    // Re-save the linked document: the hook must not re-hash the password.
    await linked.save();
    const passwordToken = await login({
      email: "a@b.com",
      password: "secret123",
    });
    expect(userIdFromToken(passwordToken)).toBe(existing._id.toString());
  });

  test("password login for a Google-only user fails with 'Password incorrect'", async () => {
    vi.spyOn(OAuth2Client.prototype, "verifyIdToken").mockResolvedValue(
      googleProfile("g-only", "only@google.com") as never,
    );
    await googleLogin("cred");
    await expect(
      login({ email: "only@google.com", password: "anything" }),
    ).rejects.toThrow("Password incorrect");
  });
});

describe("authorize middleware", () => {
  const run = async (authorization: string) => {
    const req = { get: () => authorization } as unknown as Request;
    const res = { status: vi.fn().mockReturnThis(), send: vi.fn() };
    const next = vi.fn();
    await authorize(req, res as unknown as Response, next);
    return { req, res, next };
  };

  test("loads the user from the token's _id", async () => {
    const user = await UserModel.create({
      email: "a@b.com",
      password: "secret123",
    });
    const token = jwt.sign({ _id: user._id }, process.env.tokenKey as string);
    const { req, next } = await run(`Bearer ${token}`);
    expect(next).toHaveBeenCalled();
    expect(req.currentUser?._id.toString()).toBe(user._id.toString());
    expect(req.currentUser?.email).toBe("a@b.com");
  });

  test("rejects a token without _id", async () => {
    const token = jwt.sign({ foo: "bar" }, process.env.tokenKey as string);
    const { res, next } = await run(`Bearer ${token}`);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
