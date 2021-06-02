import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../utils/providers/AuthProvider";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return user ? <Component {...props} /> : <Redirect to="/admin/login" />;
      }}
    />
  );
};

export default PrivateRoute;
