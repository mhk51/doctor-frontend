import React, { useState } from "react";
import "./login.scss";
import TextBox from "../../components/widgets/TextBox/TextBox";
import { TextField, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import Axios
import Cookies from 'js-cookie';
import Forgot from "./Forgot";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import API_BASE_URL from "../../config/config";
const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState(false);
  const openPopup = () => {
    console.log('Opening popup...');
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    console.log('Closing popup...');
    setIsPopupOpen(false);
  };
  const handleForgotPassword = () => {
    openPopup(); // Call openPopup function when "Forgot Password" is clicked
  };
    
      const handleLogin = async () => {
        try {
          setLoading(true);
          const response = await axios.post(`${API_BASE_URL}/login/`, {
            username: email,
            password: password,
          });
    
          const token = response.data.token; // Assuming your backend sends a token
          const role = response.data.role;
          // Store the token securely (e.g., in local storage or a secure HTTP cookie) for future authenticated requests.
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          console.log("token", token);
          console.log("role", role);
          // Handle a successful login response here, e.g., show a success message, and navigate to the home page.
          console.log("Login successful");
          navigate("/");
        } catch (error) {
          // Handle login errors here, e.g., show an error message.
          console.error("Login error:", error);
        }
        finally {
          setLoading(false); // Set loading to false whether the request succeeds or fails
        }
      };
   
        const [staySignedIn, setStaySignedIn] = useState(false);
      
        // Handle the checkbox change event
        const handleStaySignedInChange = (e) => {
          setStaySignedIn(e.target.checked);
        }
        // In your login component


// After the user successfully logs in
if (staySignedIn) {

  const tokenExpiration = new Date();
  tokenExpiration.setDate(tokenExpiration.getDate() + 7); // Adjust the number of days as needed

  // Store the token and its expiration date
  Cookies.set('staySignedIn', 'true', { expires: 7 });
  Cookies.set('tokenExpiration', tokenExpiration);
  
}

  return (
    <div>
    <div className="login">
      <div className="left-box">
        <div className="row1">
          <h1>Login to Your Account</h1>
          <p>Enter your credentials to continue</p>
        </div>
        <div className="row2">
          <h3>Email Address</h3>
          <TextField width={"70%"} size={"small"} text={"Enter email here"} value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="row2" >
          <h3>Password</h3>
          <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
          <TextField
              width={"70%"}
              size={"small"}
              text={"Enter password here"}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          <div className="row3" style={{marginLeft:"1rem"}} >
        <label onClick={handleForgotPassword}>
        Forgot Password?
      </label></div>
        </div>
        </div>
        <div className="row3" >
        <label>
        <input
          type="checkbox"
          checked={staySignedIn}
          onChange={handleStaySignedInChange}
          className="inlog"
        />
        Stay Signed In
      </label>
        </div>
        
        <div className="row4">
          
          {loading ? (
          <>
            <CircularProgress size={24} color="secondary" />
            <p>Login in progress...</p>
          </>
        ) : (
          <button className="login-button" onClick={handleLogin}>
           LOGIN
          </button>
        )}
        </div>
      </div>
      <div className="right-box">
        <div className="row1">
          <h1>Don't Have an Account?</h1>
        </div>
        <div className="row2">
          <p>
            Sign up now and get access to <br /> all our amazing features!
          </p>
        </div>
        <div className="row3">
          <button className="register-button" onClick={()=>navigate('/register')}>SIGN UP</button>
        </div>
      </div>
      </div>
      {isPopupOpen && <Forgot isOpen={isPopupOpen} onClose={closePopup} />}
    </div>
  );
};

export default Login;