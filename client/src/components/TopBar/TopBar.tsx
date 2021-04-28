import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
// import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    toLeft: {
      marginLeft: 'auto'
    },
    title: {
      flexGrox: 1
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: 30,
      left: 0,
      right: 0,
      margin: '0 auto'
    },
    username: {
      marginRight: 10
    },
    button: {
      [theme.breakpoints.down("xs")] : {
        width: 10
      }
    },
    login: {
      marginRight: '2%',
    }
  })
) 


export interface ITopBarActions  {
  login: () => void,
  register: () => void,
  createFilm: () => void
}

export interface ITopBar {
  actions: ITopBarActions
}

function TopBar({actions} : ITopBar) {
  const classes = useStyles();
  // const [auth, setAuth] = React.useState(true);
  const auth = false
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <AppBar position="static" color="primary" style={{}}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Drama Keeper
        </Typography> 
        <Fab onClick={actions.createFilm} color="secondary" aria-label="add" className={classes.fabButton}>
          <AddIcon />
        </Fab>
        <div className={classes.toLeft} />
        {auth ? (
          <div>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Hidden xsDown>
                <Typography className={classes.username}>
                  Username
                </Typography> 
              </Hidden>
              <Avatar />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        ) : (
          <React.Fragment>
            <Button onClick={actions.login} variant="contained" color="secondary" className={`${classes.button} ${classes.login}`}>Login</Button>
            <Button onClick={actions.register} variant="contained" color="primary">Register</Button>
          </React.Fragment>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default withWidth()(TopBar);