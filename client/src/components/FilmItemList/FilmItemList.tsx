import React from 'react'
import './FilmItemList.css'
import FilmItem, { IFilm } from '../FilmItem/FilmItem'

export interface IFilmItemList {
  filmList: IFilm[]
}

// eslint-disable-next-line no-undef
export default function FilmItemList({filmList}: IFilmItemList) : JSX.Element {
    
  console.log(filmList)

  return (
    <div className='filmList'>
        {filmList.map((film, index) => <FilmItem key={index} title={film.title} />)}
    </div>
  )
}