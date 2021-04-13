import express from "express";
import usersRouter from "./users";
import filmsRouter from "./films";


const router = express.Router();

router.use("/users", filmsRouter);
router.use("/users", filmsRouter);


router.get("/", (req, res) => {
  res.send("API router working");
});

export default router;
