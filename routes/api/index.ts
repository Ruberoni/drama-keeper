import express from "express";

const router = express.Router();
const hola = "gfff"

router.get("/", (req, res) => {
	res.send("API router working");
});

export default router;
