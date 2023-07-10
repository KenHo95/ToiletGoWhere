import React, { useRef, useState } from "react";
import { useUserContext } from "./contextAuthForm";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Signin = () => {
  const emailRef = useRef();
  const psdRef = useRef();
  const { signInUser, forgotPassword } = useUserContext();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = psdRef.current.value;
    if (email && password) {
      signInUser(email, password);
      setShouldRedirect(true); // Update the condition state to true
      navigate(-1); // Redirect the user;
    }
  };

  const forgotPasswordHandler = () => {
    const email = emailRef.current.value;
    if (email)
      forgotPassword(email).then(() => {
        emailRef.current.value = "";
      });
  };

  return (
    <div className="form">
      <h2> Login </h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Email" type="email" ref={emailRef} />
        <input placeholder="Password" type="password" ref={psdRef} />
        <Button variant="contained" type="submit">
          Sign In
        </Button>
        <p href="default.asp" target="_blank" onClick={forgotPasswordHandler}>
          Forgot Password?
        </p>
      </form>
      {shouldRedirect && <p>Redirecting...</p>}
    </div>
  );
};

export default Signin;
