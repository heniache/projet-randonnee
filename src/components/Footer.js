import { useState } from "react";
import "../styles/Footer.css";
function Footer() {
  const [inputValue, setInputValue] = useState("Entrez votre mail");
  // Fonction pour gérer le changement de valeur de l'input
  function handleChange(e) {
    setInputValue(e.target.value);
  }
  // Fonction pour vérifier la saisie lorsque l'input perd le focus
  function handleBlur() {
    if (!inputValue.includes("@"))
      alert('L\'adresse e-mail doit contenir un "@"');
  }
  return (
    <footer className="footer">
      <div className="footer-email">
        <form>
          <div className="email-label">Laissez-nous votre mail :</div>
          <textarea
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className="email-textarea"
            placeholder="Entrez votre email"
          />
        </form>
      </div>
    </footer>
  );
}
export default Footer;
