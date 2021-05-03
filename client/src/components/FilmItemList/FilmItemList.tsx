import React from 'react'
import Typography from "@material-ui/core/Typography";
import './FilmItemList.css'
import FilmItem, { IFilm } from '../FilmItem/FilmItem'

export interface IFilmItemList {
  header?: string,
  filmList: IFilm[]
}

// eslint-disable-next-line no-undef
export default function FilmItemList({header, filmList}: IFilmItemList) : JSX.Element {
    
  console.log(filmList)

  return (
    <div className='root'>
      <Typography variant='h2' className='header'>{header}</Typography>  
      <div className='filmList'>
        {filmList.map((film, index) => 
          <FilmItem 
            key={index} 
            title={film.title}
            watched={film.watched}
            links={film.links}
            images={film.images}
            actions={film.actions}/>
        )}
      </div>
    </div>
  )
}