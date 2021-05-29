import express from "express";
import * as FilmsController from "../../controllers/api/films";
import * as authMiddlewares from '../../middlewares/Auth'

const router = express.Router();

router.get("/", FilmsController.getAllFilms);
router.post("/", FilmsController.createFilm);

router.delete("/:id", FilmsController.deleteFilmById)
router.put("/:id", FilmsController.updateFilmById)

router.get("/user/:user_id", FilmsController.getFilmsByUserId)

/*
 * TESTING PURPOSES ROUTE
 *
 * Gets the films of the authorizated user
 */
router.get("/test/getfilmsauthorized", authMiddlewares.authorize, FilmsController.test.getFilmsAuthorized)

/*
 * TESTING PURPOSES ROUTE
 *
 * Creates a film with the authorizated user
 */
router.post("/test/createfilmauthorized", authMiddlewares.authorize, FilmsController.test.createFilmAuthorized)

export default router;