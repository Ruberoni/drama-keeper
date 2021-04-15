import express from "express";
import * as UsersController from "../../controllers/api/users";

const router = express.Router();

router.get("/", UsersController.getAllUsers);
router.post("/", UsersController.createUser);
router.delete("/:id", UsersController.deleteUserById);
router.put("/:id", UsersController.updateUserById);

export default router;
