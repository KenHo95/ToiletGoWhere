import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function Account(props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      props.setUser({ email: "" });
      navigate("/");
      window.location.reload();
    });
  };

  return (
    <div className="account">
      <Button variant="contained" onClick={handleLogout}>
        Logout!
      </Button>
    </div>
  );
}

export default Account;
