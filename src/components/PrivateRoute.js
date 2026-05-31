import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated() ? children : <Redirect to="/login" />
      }
    />
  );
}

export default PrivateRoute;
