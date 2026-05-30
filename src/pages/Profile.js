import ProfilDetail from "../components/ProfilDetail";
import "../styles/Login.css";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function Profile() {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <ProfilDetail />
    </div>
  );
}
export default Profile;
