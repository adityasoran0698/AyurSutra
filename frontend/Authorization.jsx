import React, { useEffect, useState } from "react";
import axios from "axios";

const Authorization = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const checkAuthorization = async () => {
      const response = await axios.get(
        "https://ayursutra-2-tl11.onrender.com/user/me"
      );
      console.log(response);
    };
    checkAuthorization();
  }, [allowedRole]);

  return children;
};
export default Authorization;
