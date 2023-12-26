import PasswordVerification from "./PasswordVerification";
import Information from "./Info";
import React, { Component, useState } from "react";
const MainPage = () => {
  const [isVerified, setIsVerified] = useState(false);

  const handlePasswordVerified = () => {
    setIsVerified(true);
  };

  return (
    <div>
      {!isVerified ? (
        <PasswordVerification onVerified={handlePasswordVerified} />
      ) : (
        <Information />
      )}
    </div>
  );
};

export default MainPage;

