import "../styles/Preferences.css";
import { useContext } from "react";
import { PreferencesContext } from "../context";
function Preferences() {
  const { darkMode, setDarkMode } = useContext(PreferencesContext);
  function CheckboxChange(e) {
    setDarkMode(e.target.checked);
  }
  return (
    <div>
      <div className={`preferences-page ${darkMode ? "dark-mode" : ""}`}>
        <h1>Préférences Utilisateur</h1>
        <label>
          <input type="checkbox" checked={darkMode} onChange={CheckboxChange} />
          Mode Sombre
        </label>
      </div>
    </div>
  );
}
export default Preferences;
