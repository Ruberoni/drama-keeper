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

import FilmsModel from "../../models/Film";
import Debug from "debug";
import { Response, Request } from "express";
import fs from "fs";
import path from "path";

const debug = Debug("film");

/*
 * Send all the films as the response.
 */
export const getAllFilms = async (
  req: Request,
  res: Response
  ): Promise<void | Response> => {
  debug("CONTROLLER: getAllFilms | EXECUTED");
  try {
    const films = await FilmsModel.find();
    res.send(films);
    debug("CONTROLLER: getAllFilms | FINISHED GOOD");
  } catch (err) {
    debug("CONTROLLER: getAllFilms | ERROR:", err.message);
    res.status(400).send(err.message);
  }
};

/*
 * Creates an films.
 * req.body has to have the information needes for creating an user document.
 */
export const createFilm = async (
  req: Request,
  res: Response
  ): Promise<void | Response> => {
  debug("CONTROLLER: createFilm | EXECUTED");

  try {
    const filmInfo = req.body;
    await FilmsModel.create(filmInfo);
    res.send("Film created");
    debug("CONTROLLER: createFilm | FINISHED GOOD");
  } catch (err) {
    debug("CONTROLLER: createFilm | ERROR:", err.message);
    res.status(400).send(err.message);
  }
};

const imagePath = path.resolve("./assets/img/panes.png");

/*
 * TESTING PURPOSES CONTROLLERS
 * CALL THEM WITH /api/films/test/<function name>/<uri params>
 */
export const test = {
  
  /*
   * Adds the img in imgPath const to the film
   * @uriparams {integer} id The film to add the image
   */
  async addCover(req: Request, res: Response): Promise<void | Response> {
    debug("TEST CONTROLLER: addCover | EXECUTED");
    try {
      // Get film id from params
      const id = req.params.id;
      // Get film with id
      const Film = await FilmsModel.findById(id);
      if (!Film) throw "Film doesn't exist";
      debug("TEST CONTROLLER: addCover Film exist");

      // Save img with fs module
      fs.readFile(imagePath, async (err, imageData) => {
        if (err) throw err;
        await Film.addCover(imageData, 'png');

        // Call film method to save img (await)

        // Send success response
        debug("TEST CONTROLLER: addCover | FINISHED GOOD");
        res.send("Success adding image to film");
      });
    } catch (err) {
      // Send error response
      debug("TEST CONTROLLER: addCover | ERROR:", err.message);
      res.status(400).send(err.message);
    }
  },

  async addCoverCompressed(req: Request, res: Response): Promise<void | Response> {
    debug("TEST CONTROLLER: addCoverCompressed | EXECUTED");
    try {
      // Get film id from params
      const id = req.params.id;
      // Get film with id
      const Film = await FilmsModel.findById(id);
      if (!Film) throw "Film doesn't exist";
      debug("TEST CONTROLLER: addCoverCompressed Film exist");

      // Save img with fs module
      fs.readFile(imagePath, async (err, imageData) => {
        if (err) throw err;

        await Film.addCoverCompressed(imageData, 'png');

        // Call film method to save img (await)
                               
        // Send success response
        debug("TEST CONTROLLER: addCoverCompressed | FINISHED GOOD");
        res.send("Success adding image to film");
      });
    } catch (err) {
      // Send error response
      debug("TEST CONTROLLER: addCoverCompressed | ERROR:", err.message);
      res.status(400).send(err.message);
    }
  },

  /*
   * Shows the image in images.cover property of the document
   * @uriparams {integer} id The id of the document to show the cover
   */
  async showCover(req: Request, res: Response): Promise<void | Response> {
    debug("TEST CONTROLLER: showCover | EXECUTED");
    try {
      // Get id from param
      const id = req.params.id;
      // Get Film by id
      const Film = await FilmsModel.findById(id);
      if (!Film) throw "Film doesn't exist";
      debug("TEST CONTROLLER: showCover | Film exist");

      // set response contentType
      res.type(Film?.images?.cover?.contentType ?? "html");
      // send response with the data
      debug("TEST CONTROLLER: showCover | FINISHED GOOD");
      res.send(Film?.images?.cover?.data ?? "");
    } catch (err) {
      debug("TEST CONTROLLER: addImage | ERROR:", err.message);
      res.status(400).send(err.message);
    }
  },
};
