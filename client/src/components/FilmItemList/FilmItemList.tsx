import React from 'react'
import Typography from "@mui/material/Typography";
import './FilmItemList.css'
import FilmItem, { IFilm } from '../FilmItem/FilmItem'

export interface IFilmItemList {
  header?: string,
  filmList: IFilm[]
}

export default function FilmItemList({header, filmList}: IFilmItemList) : JSX.Element {
  return (
    <div className='root'>
      <Typography variant='h2' className='header'>{header}</Typography>  
      <div className='filmList'>
        {filmList.map((film) => 
          <FilmItem 
            key={film._id} 
            _id={film._id}
            title={film.title}
            watched={film.watched}
            links={film.links}
            images={film.images}/>
        )}
      </div>
    </div>
  )
}