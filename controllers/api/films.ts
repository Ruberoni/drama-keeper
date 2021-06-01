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
    const currentUser = req.params.user_id || '';
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

      await FilmsModel.create({user: currentUser?._id, ...filmData})

      res.json({message: 'Film created'});

    } catch (err) {
      res.status(400).json({message: 'error', err: err.message})
    }
  }
};