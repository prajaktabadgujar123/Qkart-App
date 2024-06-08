import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  let history = useHistory();
  

  const setAll = {
    setUsername,
    setPassword,
    setConfirmPassword
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAll[`set${name}`](value);

  };



  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  
  
  const register = async () => {
    setLoading(true)
   if (!validateInput())
       return;
    let msg, variant = 'success';
    const formData = { username: username, password: password };
   try {
      
      const response = await axios.post(
        `${config.endpoint}/auth/register`, formData,
        { validateStatus: status => status >= 200 && status < 500 }
      );
     if (!response.data.success)
     {
       variant='error'
       }
      msg = response.data.success ? "Registered Successfully" : response.data.message;

    } catch (e) {
      msg = "Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
      variant = "error";
    } 
    setLoading(false)
    enqueueSnackbar(msg, { variant });
    if (variant === 'success')
    {
      history.push('/login')
     }
   
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = () => {
    let validation = true;
    let msg="Loading", variant="warning";
    if (username.length === 0)
    {
      validation = false;
      msg="Username is a required field"
      
    }
    else if (username.length < 6)
    {
      validation = false;
      msg="Username must be at least 6 characters"
      
    }
   else if (password.length === 0)
    {
      validation = false;
      msg = "Password is a required field";
    }
  else  if (password.length < 6)
    {
      validation = false;
      msg="Password must be at least 6 characters"
    }
   else if (password !== confirmPassword)
    {
      validation = false;
      msg="Passwords do not match"
    }
    if (validation === false) {
      enqueueSnackbar(msg, { variant });
    }

    return validation;

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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
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
            label="Password"
            name="Password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={password}
            onChange={handleChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="ConfirmPassword"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={handleChange}

          />
           {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5, height: 36.5, boxSizing: 'border-box' }}>
              <CircularProgress color="success" />
            </Box>
          ) : (
            <Button className="button" variant="contained" onClick={register}>
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
             {/* <a className="link" href="#">
              Login here
             </a> */}
            <Link to="/login" className="link">Login here</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
