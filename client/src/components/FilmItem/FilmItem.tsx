import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
// import Paper from '@material-ui/core/Paper';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import cover from '../../assets/img/when-harry-met-sally-cover.jpg'
import rottenTomatoesLogoPng from '../../assets/img/Rotten_Tomatoes_Logo.svg.png'

const scale = 1

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: "10%",
      marginLeft: "10%",
      display: "flex",
      maxWidth: 360 * scale  ,
      height: 80 * scale
    },
    bar: {
      width: 15 * scale, 
      backgroundColor: 'red', 
      boxShadow: 'inset 0px 0px 4px 0px rgba(0,0,0,0.2)'    
    },
    media: {
      padding: 10 * scale,
      width: 25 * scale,
    },
    cover: {
      height: 60 * scale
    },
    details: {
      display: "flex",
      flexDirection: "column",
      width: 400 * scale
    },  
    content: {
      flex: "1 0 auto",
      width: '100%'
    },
    divider: {
      height: 1 * scale, 
      backgroundColor: 'red', 
      width: '90%'
    },
    rottenTomatoesSection: {
    },
    rottenTomatoesLink: {
      display: 'flex',
      justifyContent: 'space-between',
      maxWidth: 130,
      marginTop: 5,

      textDecoration: 'none',
      color: 'black'
    },
    rottenTomatoesLogo: {
      height: 14,
      marginTop: 2,
    },
    actions: {
      marginLeft: '5%',
      width: 150 * scale
    },
  })
);

export default function FilmItem() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card className={classes.root} square>
      <div className={classes.bar}>
      </div>
      <CardMedia
        className={classes.media}
        title="Film cover">
          <img src={cover} alt="Cover" className={classes.cover} />
      </CardMedia>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography variant="body1">When Harry Met Sally</Typography>
          <div className={classes.divider}></div>
          <div className={classes.rottenTomatoesSection}>
            <a href="#" className={classes.rottenTomatoesLink}>
              <Typography variant="body2">RottenTomatoes</Typography>
              <img className={classes.rottenTomatoesLogo} src={rottenTomatoesLogoPng} />
            </a> 
          </div>
        </CardContent>
      </div>
      <CardActions className={classes.actions}>
        <IconButton edge='end' aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
            <MenuItem onClick={handleClose}>Delete</MenuItem>
            <MenuItem onClick={handleClose}>Update</MenuItem>
            <MenuItem onClick={handleClose}>Watched</MenuItem>
      </Menu>
      </CardActions>
    </Card>
  );
}