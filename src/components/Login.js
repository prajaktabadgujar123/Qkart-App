import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  const setAll = {
    setUsername,
    setPassword
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAll[`set${name}`](value);

  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async () => {
    
    if (!validateInput())
      return 
    
    const formData = { username: username, password: password }
    let msg, variant = 'success';
    try {
      setLoading(true)
      const response = await axios.post(
        `${config.endpoint}/auth/login`, formData,
        { validateStatus: status => status >= 200 && status < 500 }
      );
       if (!response.data.success)
     {
       variant='error'
       }
       else
       {
         console.log(response.data)
         let {token,username,balance}=response.data
         persistLogin(token, username, balance);

         }
      msg = response.data.success ? "Logged in successfully" : response.data.message;

    } catch (e) {
      msg = "Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
      variant = "error";
    } 
    setLoading(false)
    enqueueSnackbar(msg, { variant });

    if (variant === 'success')
    {
      history.push('/')
    }
    

  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = () => {
    let validation = true;
    let msg = "Loading", variant = "warning";
     if (username.length === 0)
    {
      validation = false;
      msg="Username is a required field"
      
     }
     else if (password.length===0)
     { 
       validation = false;
       msg="Password is a required field"
       
     }
    if (validation === false) {
      enqueueSnackbar(msg, { variant });
    }

    return validation;

  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('balance', balance);

  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="username"
            variant="outlined"
            title="Username"
            name="Username"
            placeholder="Enter Username"
            fullWidth
            value={username}
            onChange={handleChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="password"
            name="Password"
            type="password"
            fullWidth
            placeholder="Enter password"
            value={password}
            onChange={handleChange}
          />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5, height: 36.5, boxSizing: 'border-box' }}>
              <CircularProgress color="success" />
            </Box>
          ) : (
            <Button className="button" variant="contained" onClick={login}>
              LOGIN TO QKART
            </Button>
          )}
          <p className="secondary-action">
            Don't have an account?{" "}
             {/* <a className="link" href="">
              Register now
             </a> */}
            <Link to="/register" className="link" name="register now">Register now</Link>
          </p>
          <br></br>
          <br></br>
          <br></br>

        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
