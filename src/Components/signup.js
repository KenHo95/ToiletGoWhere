import React, { useRef } from "react";
import { useUserContext } from "./ContextAuthForm";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const emailRef = useRef();
  const nameRef = useRef();
  const psdRef = useRef();
  const { registerUser } = useUserContext();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const name = nameRef.current.value;
    const password = psdRef.current.value;
    if (email && password && name) registerUser(email, password, name);
    navigate("/");
  };

  return (
    <div className="form">
      <h2> New User</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Email" type="email" ref={emailRef} />
        <input placeholder="Name" type="name" ref={nameRef} />
        <input placeholder="Password" type="password" ref={psdRef} />
        <br />
        <Button variant="contained" type="submit">
          Sign Up
        </Button>
        <br />
      </form>
    </div>
  );
};

export default Signup;
