import React, { createContext, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SERVER_URL } from "../config/serverURL";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [userData, setUserData] = useState({
    token: "",
    user: "",
  });
  const { setIsAuth } = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    const isLogin = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        return;
      }
      const tokenRes = await fetch(`${SERVER_URL}/validToken`, {
        method: "POST",
        headers: { "x-auth-token": token },
      });
      const tokenIsValid = await tokenRes.json();

      if (tokenIsValid) {
        const userRes = await fetch(`${SERVER_URL}/user`, {
          method: "GET",
          headers: { "x-auth-token": token },
        });
        const userData = await userRes.json();
        setUserData({
          token,
          user: userData.id,
        });
        setIsAuth(true);
        history.push("/notes");
      }
    };

    isLogin();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
