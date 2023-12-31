import { createContext, useContext, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";

export const UserContext = createContext({});

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Define the successMessage state
  const navigate = useNavigate();
  const location = useLocation();

  useState(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (res) => {
      if (res) {
        setUser(res);
      } else {
        setUser(null);
      }
      setError("");
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const registerUser = (email, password, name) => {
    setLoading(true);
    setError("");
    createUserWithEmailAndPassword(auth, email, password)
      .then(() =>
        updateProfile(auth.currentUser, {
          displayName: name,
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const signInUser = (email, password) => {
    setLoading(true);
    setError("");

    signInWithEmailAndPassword(auth, email, password)
      .catch((err) => setError(err.code))
      .finally(() => setLoading(false));
  };

  const signInWithGoogle = () => {
    setLoading(true);
    setError("");

    signInWithPopup(auth, new GoogleAuthProvider())
      .then((res) => {
        // Navigate the user to the previous page after successful sign-in
        if (location.state && location.state.from) {
          navigate(location.state.from);
        } else {
          navigate("/");
        }
      })

      .catch((err) => setError(err.code))
      .finally(() => setLoading(false));
  };

  const logoutUser = () => {
    signOut(auth);
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccessMessage("An email has been sent to reset your password.");
      })
      .catch((error) => {
        setError("Failed to send the password reset email.");
        console.log("Error sending password reset email:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const contextValue = {
    user,
    loading,
    error,
    signInUser,
    registerUser,
    logoutUser,
    forgotPassword,
    signInWithGoogle,
  };
  return (
    <div>
      {/* Apply CSS class to the error message */}
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="error">{successMessage}</p>}
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    </div>
  );
};
