/*
 * Here goes the controllers for user routes: /api/users
 *
 *   RESUME:
 *
 * - For retrieve all the films:
 *   getAllFilms
 *
 * - For creating a film:
 *   createFilm
 *
 * - For delete a film:
 *   deleteFilmById
 *
 * - For updating a film:
 *   updateFilmById
 *
 * - For retrieving films of a user
 *   getFilmsByUserId
 */

import FilmsModel from "../../models/Film";
import Debug from "debug";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const debug = Debug("film");

/*
 * Send all the films as the response.
 */
export const getAllFilms = async (
  req: Request,
  res: Response
  ) => {
  debug("CONTROLLER: getAllFilms | EXECUTED");
  try {

    let films = await FilmsModel.find();
    const watchedString = req.query.watched
    if (watchedString) {
      const watched = (watchedString === 'true')
      films = films.filter((film) => film?.watched === watched)
    }
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

/*
 * Send all the films of the user to the response.
 */
export const getFilmsByUserId = async (
  req: Request,
  res: Response
  ): Promise<void | Response> => {
  debug("CONTROLLER: getFilmsByUser | EXECUTED");
  try {
    const currentUser = req.params.user_id;
    let films = await FilmsModel.find({user: currentUser});

    const watchedString = req.query.watched
    if (watchedString) {
      const watched = (watchedString === 'true')
      films = films.filter((film) => film?.watched === watched)
    }

    res.json({message: `Films of user ${currentUser}`, films});
    debug("CONTROLLER: getFilmsByUser | FINISHED GOOD");
  } catch (err) {
    debug("CONTROLLER: getFilmsByUser | ERROR:", err.message);
    res.status(400).send(err.message);
  }
};

/*
 * Deletes a film by id. 
 */
export const deleteFilmById = async (
  req: Request,
  res: Response
  ): Promise<void | Response> => {
  debug("CONTROLLER: deleteFilmById | EXECUTED");
  try {
    const id = req.params.id;
    await FilmsModel.findByIdAndDelete(id);
    res.send("Film deleted");
    debug("CONTROLLER: deleteFilmById | FINISHED GOOD");
  } catch (err) {
    debug("CONTROLLER: deleteFilmById | ERROR:", err.message);
    res.status(400).send(err.message);
  }
};

/*
 * Updates a film by id. 
 */
export const updateFilmById = async (
  req: Request,
  res: Response
  ): Promise<void | Response> => {
  debug("CONTROLLER: updateFilmById | EXECUTED");
  try {
    const id = req.params.id;
    const filmInfo = req.body;

    await FilmsModel.findByIdAndUpdate(id, filmInfo);

    res.send("Film updated");
    debug("CONTROLLER: updateFilmById | FINISHED GOOD");
  } catch (err) {
    debug("CONTROLLER: updateFilmById | ERROR:", err.message);
    res.status(400).send(err.message);
  }
}

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
  // async addCover(req: Request, res: Response): Promise<void | Response> {
  //   debug("TEST CONTROLLER: addCover | EXECUTED");
  //   try {
  //     // Get film id from params
  //     const id = req.params.id;
  //     // Get film with id
  //     const Film = await FilmsModel.findById(id);
  //     if (!Film) throw "Film doesn't exist";
  //     debug("TEST CONTROLLER: addCover Film exist");

  //     // Save img with fs module
  //     fs.readFile(imagePath, async (err, imageData) => {
  //       if (err) throw err;
  //       await Film.addCover(imageData, 'png');

  //       // Call film method to save img (await)

  //       // Send success response
  //       debug("TEST CONTROLLER: addCover | FINISHED GOOD");
  //       res.send("Success adding image to film");
  //     });
  //   } catch (err) {
  //     // Send error response
  //     debug("TEST CONTROLLER: addCover | ERROR:", err.message);
  //     res.status(400).send(err.message);
  //   }
  // },

  // async addCoverCompressed(req: Request, res: Response): Promise<void | Response> {
  //   debug("TEST CONTROLLER: addCoverCompressed | EXECUTED");
  //   try {
  //     // Get film id from params
  //     const id = req.params.id;
  //     // Get film with id
  //     const Film = await FilmsModel.findById(id);
  //     if (!Film) throw "Film doesn't exist";
  //     debug("TEST CONTROLLER: addCoverCompressed Film exist");

  //     // Save img with fs module
  //     fs.readFile(imagePath, async (err, imageData) => {
  //       if (err) throw err;

  //       await Film.addCoverCompressed(imageData, 'png');

  //       // Call film method to save img (await)
                               
  //       // Send success response
  //       debug("TEST CONTROLLER: addCoverCompressed | FINISHED GOOD");
  //       res.send("Success adding image to film");
  //     });
  //   } catch (err) {
  //     // Send error response
  //     debug("TEST CONTROLLER: addCoverCompressed | ERROR:", err.message);
  //     res.status(400).send(err.message);
  //   }
  // },

  // /*
  //  * Shows the image in images.cover property of the document
  //  * @uriparams {integer} id The id of the document to show the cover
  //  */
  // async showCover(req: Request, res: Response): Promise<void | Response> {
  //   debug("TEST CONTROLLER: showCover | EXECUTED");
  //   try {
  //     // Get id from param
  //     const id = req.params.id;
  //     // Get Film by id
  //     const Film = await FilmsModel.findById(id);
  //     if (!Film) throw "Film doesn't exist";
  //     debug("TEST CONTROLLER: showCover | Film exist");

  //     // set response contentType
  //     res.type(Film?.images?.cover?.contentType ?? "html");
  //     // send response with the data
  //     debug("TEST CONTROLLER: showCover | FINISHED GOOD");
  //     res.send(Film?.images?.cover?.data ?? "");
  //   } catch (err) {
  //     debug("TEST CONTROLLER: addImage | ERROR:", err.message);
  //     res.status(400).send(err.message);
  //   }
  // },

  /*
   * Retrieve the films of the user in the req.uerId
   */
  getFilmsAuthorized: async (req: Request, res: Response) => {
    try {
      const currentUser = req.currentUser

      const films = await FilmsModel.find({user: currentUser})

      res.json({message: `Films of user ${currentUser}`, films});

    } catch (err) {
      res.status(400).json({message: 'error', err: err.message})
    }
  },
  createFilmAuthorized: async (req: Request, res: Response) => {
    try {
      const currentUser = req.currentUser
      const filmData = req.body

      await FilmsModel.create({user: currentUser._id, ...filmData})

      res.json({message: 'Film created'});

    } catch (err) {
      res.status(400).json({message: 'error', err: err.message})
    }
  }
};