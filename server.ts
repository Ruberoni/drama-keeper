import express from 'express'
import dbg from 'debug'

const debug = dbg('http')
const app = express()

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
	res.send("Route working")
})

app.listen(port, () => {
	debug("Listening on port:", port)
})