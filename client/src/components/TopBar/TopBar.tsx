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
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
import { useApp } from '../../context'

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

function TopBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const app = useApp()

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose()
    app.auth.logout()
  }

  const handleCreateModal = () => {
    app.openAppModal({modal: "CREATE_FILM"})
  }

  const handleLoginModal = () => {
    app.openAppModal({modal: "LOGIN"})
  }

  const handleRegisterModal = () => {
    app.openAppModal({modal: "REGISTER"})
  }

  return (
    <AppBar position="static" color="primary" style={{}}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Drama Keeper
        </Typography> 
        <Fab onClick={handleCreateModal} color="secondary" aria-label="add" className={classes.fabButton}>
          <AddIcon />
        </Fab>
        <div className={classes.toLeft} />
        {app.state.authToken ? (
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
                  Logged In
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
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <React.Fragment>
            <Button onClick={handleLoginModal} variant="contained" color="secondary" className={`${classes.button} ${classes.login}`}>Login</Button>
            <Button onClick={handleRegisterModal} variant="contained" color="primary">Register</Button>
          </React.Fragment>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default withWidth()(TopBar);