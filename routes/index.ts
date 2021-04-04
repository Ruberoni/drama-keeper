import express from "express";
import apiRouter from "./api/index";

const router = express.Router();

router.use("/api", apiRouter);

router.get("/", (req, res) => {
	res.send("Index route working");
});

export default router;
