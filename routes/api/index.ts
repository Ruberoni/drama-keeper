import express from "express";
import usersRouter from "./users";
import filmsRouter from "./films";
import authRouter from "./auth";


const router = express.Router();

router.use("/users", usersRouter);
router.use("/films", filmsRouter);
router.use("/auth", authRouter);


router.get("/", (req, res) => {
  res.send("API router working");
});

export default router;
