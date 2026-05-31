import { Route, Redirect } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../utils/auth";

function AdminRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => {
        if (!isAuthenticated()) return <Redirect to="/login" />;
        if (!isAdmin()) return <Redirect to="/" />;
        return children;
      }}
    />
  );
}

export default AdminRoute;
