import { useState } from "react";
import { auth, signInWithGoogle } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "../App.css";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log(user);
    setEmail("");
    setPassword("");
  };

  const signIn = async () => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
    setEmail("");
    setPassword("");
    // eslint-disable-next-line no-restricted-globals
    location.reload(); // to refresh user linked states
  };

  return (
    <div>
      <label>Email</label>
      <br />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Here"
      />
      <br />
      <label>Password</label>
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password Here"
      />
      <br />
      <button onClick={signUp}>SignUp</button> <br />
      <button onClick={signIn}>SignIn</button> <br />
      <button
        type="button"
        className="login-with-google-btn"
        onClick={signInWithGoogle}
      >
        Sign In With Google
      </button>
      {/* <h1>{localStorage.getItem("name")}</h1>
      <h1>{localStorage.getItem("email")}</h1>
      <h1>{localStorage.getItem("profilePic")}</h1> */}
    </div>
  );
}
