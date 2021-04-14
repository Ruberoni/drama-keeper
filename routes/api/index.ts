import express from "express";
import usersRouter from "./users";
import filmsRouter from "./films";


const router = express.Router();

router.use("/users", usersRouter);
router.use("/films", filmsRouter);


router.get("/", (req, res) => {
  res.send("API router working");
});

export default router;
