/**
# Film

## Create
POST `/films/{user_id}`

## Get films by user
GET `/films/{user_id}`

## Get films by user where watched is true:
GET `/films/{user_id}?watched=true`

## Get films by user where watched is false:
GET `/films/{user_id}?watched=false`

## Delete film by id
DELETE `/films/{film_id}`

## Update film by id
PUT `/films/{film_id}`
**/

import express from "express";
import * as FilmsController from "../../controllers/api/films";

const router = express.Router();

router.get("/", FilmsController.getAllFilms);
router.post("/", FilmsController.createFilm);

/*
 * TESTING PURPOSES ROUTE
 *
 * Adds the image in assets/img to a document
 * @params {integer} id The id of the document to add the image
 */
router.post("/test/addcover/:id", FilmsController.test.addCover)

/*
 * TESTING PURPOSES ROUTE
 *
 * Shows the image in images.cover property of the document
 * @params {integer} id The id of the document to add the image
 */
router.post("/test/showcover/:id", FilmsController.test.showCover)


export default router;
