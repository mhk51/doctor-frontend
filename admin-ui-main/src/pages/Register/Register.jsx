import React, {useState, useEffect} from "react";
import "./register.scss";
import TextBox from "../../components/widgets/TextBox/TextBox";
import { TextField, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import DropDown from "../../components/widgets/DropDown/DropDown";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import Axios
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import API_BASE_URL from "../../config/config";
const Register = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState(""); 
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");  // Define state variable for the role
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    /*const fetchRoles = () => {
  axios.get("http://127.0.0.1:8000/roles/")
    .then(response => {
      setRoles(response.data);
    })
    .catch(error => {
      console.error("Error fetching roles:", error);
    });
};*/
/*const fetchRoles = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/roles/");
    setRoles(response.data); // Assuming the response contains an array of roles
    
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
}; 
  */
const predefinedRoles = [
  { idrole: 1, name: "Doctor" },
  { idrole: 2, name: "Nurse" },
  { idrole: 3, name: "Secretary" },
];
   /* useEffect(() => {
      // Fetch roles when the component mounts
      fetchRoles();
      console.log("roles", roles);

    }, []);*/

    const handleRegister = async () => {
      /*console.log("Selected Role:", role);
      console.log("All Roles:", roles);*/
      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        setLoading(true); // Set loading to true when starting the request
        // Send a POST request to the backend to register the user
        const response = await axios.post(`${API_BASE_URL}/signup/`, {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          role_idrole: role,
          
        });
        console.log("user", response);
        setUser({
          firstName: firstName,
          lastName: lastName,
        });
        // Handle a successful registration response here, e.g., show a success message, and navigate to the login page.
        console.log("Registration successful");
        navigate("/login");
      } catch (error) {
        // Handle registration errors here, e.g., show an error message.
        console.error("Registration error:", error);
      } finally {
        setLoading(false); // Set loading to false whether the request succeeds or fails
      }
      
    };
  return (
    <div className="register">
      <div className="leftbox">
        <div className="row1">
          <h1>Already Have An Account?</h1>
        </div>
        <div className="row2">
          <p>
            Sign in now using your credentials
            <br />
            and enjoy access to our exclusive features and services!
          </p>
        </div>
        <div className="row3">
          <button onClick={()=> navigate('/login')} className="register-button">SIGN IN</button>
        </div>
      </div>
      <div className="rightbox">
        <div className="row1">
          <h1>Create an Account</h1>
          <p>Fill in all required fields to continue</p>
        </div>
        <div className="row2">
          <h3>First name</h3>
          <TextField width={"100%"} size={"small"} text={"Enter first name"} value={firstName}
  onChange={(e) => setFirstName(e.target.value)}/>
        </div>
        <div className="row2">
          <h3>Last name</h3>
          <TextField width={"70%"} size={"small"} text={"Enter last name"} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="row2">
          <h3>Email Address</h3>
          <TextField width={"70%"} size={"small"} text={"Enter email here"} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="row2">
        <h3>Role</h3>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "50%" }}
        >
          <option value="">Select a role</option>
          {predefinedRoles.map((role) => (
            <option key={role.idrole} value={role.idrole}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
        <div className="row2">
          <h3>Password</h3>
       
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
        </div>
        <div className="row2">
          <h3>Confirm Password</h3>
      
          <TextField
              width={"70%"}
              size={"small"}
              text={"Enter password here"}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
        </div>
       

        <div className="row4">
          
          {loading ? (
          <>
            <CircularProgress size={24} color="secondary" />
            <p>Registration in progress...</p>
          </>
        ) : (
          <button className="login-button" onClick={handleRegister}>
            SIGN UP
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default Register;
