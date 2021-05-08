import '../config/env'
import app from '../index'
import request from 'supertest'

describe("GET /", () => {
	test("It should respond with a string", async () => {
		const response = await request(app).get('/')
		expect(response.text).toEqual("Index")
		expect(response.status).toBe(200)
	})
})