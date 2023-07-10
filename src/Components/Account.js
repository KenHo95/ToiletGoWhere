import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function Account() {
  const [user, setUser] = useState({ email: "" });
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser({ email: "" });
      navigate("/");
      window.location.reload();
    });
  };

  return (
    <div>
      <Button variant="contained" onClick={handleLogout}>
        Logout!
      </Button>
    </div>
  );
}

export default Account;
