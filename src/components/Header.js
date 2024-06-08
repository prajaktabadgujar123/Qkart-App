import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import {useHistory} from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const username = localStorage.getItem("username");
  let buttons;
  if (!username)
  {
    buttons = (
      <Box>
        <Stack direction="row" spacing={2}>
          <Button variant="text" onClick={() => history.push('/login')}>LOGIN</Button>
          <Button variant="contained" onClick={()=>history.push('/register')}>REGISTER</Button>
        </Stack>
        </Box>
    );
  }
  else
  {
    buttons = (
      <Box>
        <Stack direction="row" spacing={2}>
          {/* <img src="avatar.png" alt={username} width="25" height="25" /> */}
          <Avatar alt={username} src="avatar.png"/>
          <p style={{ marginTop:'10px'}}>{username}</p>
          <Button variant="text" onClick={() => {
            history.push('/');
            window.location.reload();
            localStorage.removeItem("username");
            localStorage.clear();
          }}>LOGOUT</Button>
        </Stack>
      </Box>
    )
    }


  const handleClick = () =>
  {
    history.push('/'); 
    }
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        {hasHiddenAuthButtons?( <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={handleClick}
        >
          Back to explore
        </Button>) : (
            buttons
         )}
      </Box>
    );
};

export default Header;
