import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { makeStyles } from 'tss-react/mui';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useApp } from '../../context'

const useStyles = makeStyles()((theme) => 
  ({
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
      [theme.breakpoints.down('sm')] : {
        width: 10
      }
    },
    login: {
      marginRight: '2%',
    }
  }));

function TopBar() {
  const { classes } = useStyles();
  // Show the "Logged In" label from the sm breakpoint up (was <Hidden xsDown>).
  const showUsername = useMediaQuery(useTheme().breakpoints.up('sm'), { noSsr: true });
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
              size="large">
              {showUsername && (
                <Typography className={classes.username}>
                  Logged In
                </Typography>
              )}
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
  );
}

export default TopBar;
