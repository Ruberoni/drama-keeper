import express from "express";
import * as UsersController from "../../controllers/api/users";

const router = express.Router();

router.get("/", UsersController.getAllUsers);
router.post("/", UsersController.createUser);

export default router;
