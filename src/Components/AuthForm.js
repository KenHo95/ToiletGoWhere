import React, { useState } from "react";
import { useUserContext } from "./ContextAuthForm";
import Signin from "./Signin";
import Signup from "./Signup";

const Auth = () => {
  const [index, setIndex] = useState(false);
  const toggleIndex = () => {
    setIndex((prevState) => !prevState);
  };

  const { signInWithGoogle } = useUserContext();

  return (
    <div className="auth-container">
      {!index ? <Signin /> : <Signup />}
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        {" "}
        Continue with Google{" "}
      </button>
      <p onClick={toggleIndex}>
        {!index ? "New user? Click here " : "Already have an acount? Sign in!"}
      </p>
    </div>
  );
};

export default Auth;
