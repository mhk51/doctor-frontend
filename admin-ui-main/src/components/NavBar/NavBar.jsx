import React, {useState, useEffect} from "react";

import "./navbar.scss";

import { BellSimple, Globe, SignOut } from "@phosphor-icons/react";

import SearchBar from "../widgets/SearchField/Searchbar";

import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import Axios
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import Cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from "../../config/config";
 

const languages = [
  {
    code: 'fr',
    name: 'Français',
    country_code: 'fr',
  },
  {
    code: 'en',
    name: 'English',
    country_code: 'gb',
  },
  {
    code: 'ar',
    name: 'العربية',
    dir: 'rtl',
    country_code: 'sa',
  },
]
 

const NavBar = () => {
  const navigate = useNavigate();
  const currentLanguageCode = Cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
    document.title = t('NAME')
    
    
  }, [currentLanguage, t])

  const handleLogout = async () => {
    try {
      
      // Remove the token from local storage (client-side)
     
      // Send a request to the server to handle server-side logout
      const response = await axios.post(
        `${API_BASE_URL}/logout/`,  // server-side logout URL
        
      );
  
      // Handle the response as usual
      if (response.status === 200) {
    
        Cookies.remove("staySignedIn");
        Cookies.remove('tokenExpiration');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        i18next.changeLanguage('en'); // Change the language to English
        document.body.dir = 'ltr'; 
        navigate("/login");
      }
    } catch (error) {
      
      // Handle errors here
      console.error("Logout error:", error);
    }
  };
  
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  
  return (

    <div className="navbar">

      <div className="wrapper">

        <div className="search">

            <SearchBar/>

        </div>

        <div className="items">

          <div className="item">

            <div

              style={{

                borderRight: "1px solid #C5C0C0",

                height: "10vh",

                display: "flex",

                alignItems: "center",

              }}

            >

 

<div className="globe-dropdown">
      <span className="globe-icon" onClick={toggleDropdown}>
    <Globe size={25} className="iconnav" style={{ color: "#004957" }} />
  </span>
  {isDropdownVisible && (
        <ul className="language-dropdown" onClick={closeDropdown}>
   
    {languages.map(({ code, name, country_code }) => (
      <li key={country_code}>
        <a
          href="#"
          class={classNames('dropdown-item', {
            disabled: currentLanguageCode === code,
          })}
          onClick={() => {
            i18next.changeLanguage(code);
          }}
        >
          <span
            class={`flag-icon flag-icon-${country_code} mx-2`}
            style={{
              opacity: currentLanguageCode === code ? 0.5 : 1,
            }}
          ></span>
          {name}
        </a>
      </li>
    ))}
  </ul>
    )}
</div>

                 
         

              <SignOut

                size={28}

                className="iconnav"

                style={{ color: "red", padding: "20px", cursor: "pointer" }}
                onClick={handleLogout}

              />

            </div>

            <BellSimple

              size={26}

              className="iconnav"

              style={{ color: "#004957", padding: "20px", cursor: "pointer" }}

            />

          </div>

        </div>

      </div>

    </div>

  );

};
export default NavBar;