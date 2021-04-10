import express from "express";
import usersRouter from "./users";

const router = express.Router();

router.use("/users", usersRouter);

router.get("/", (req, res) => {
  res.send("API router working");
});

export default router;
