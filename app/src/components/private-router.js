import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import isAutenticated from "../utils/isAuthenticated";

const PrivateRoute = ({ component: Component, role, ...rest }) => {
  const [autenticated, setAutenticated] = useState(true);
  const [logged, setLogged] = useState(null);

  if (logged) {
    if (role) {
      if (!role.includes(logged.usuario.TipoUsuario.nome)) {
        window.location.href = `${process.env.REACT_APP_DOMAIN}/`;
      }
    }
  }

  useEffect(() => {
    isAutenticated().then((_) => {
      setAutenticated(_.logged);
      if(_.data){
        setLogged(_.data);
      }else {
        setLogged(null);
      }
    });
  });

  if (!autenticated) {
    window.location.href = `${process.env.REACT_APP_DOMAIN}/login`;
  }

  if (logged && autenticated) {
    return (
      <Route
        {...rest}
        render={(props) => <Component {...props} logged={logged} />}
      />
    );
  } else {
    return <div></div>;
  }
};

export default PrivateRoute;
