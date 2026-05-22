import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
function LoginDetail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useHistory();
  useEffect(() => {
    // Vérifiez si un token est déjà stocké localement
    const token = localStorage.getItem("token");
    if (token) {
      // Si un token est présent, redirigez l'utilisateur vers la page de profil (hook useNavigate)
      navigate.push("/profile");
    }
  }, [navigate]);

  // gere l'inscription et la connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const url = isSignup
      ? "http://localhost:3001/signup"
      : "http://localhost:3001/login";

    try {
      if (!email || !password) {
        setErrorMessage("Veuillez remplir tous les champs.");
        return;
      } else {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Une erreur est survenue.");
        }

        if (isSignup) {
          setIsSignup(false);
          setPassword("");
          alert(
            "Compte créé avec succès. Vous pouvez maintenant vous connecter.",
          );
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          navigate.push("/profile");
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{isSignup ? "Inscription" : "Connexion"}</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="main-button">
            {isSignup ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <p className="switch-text">
          {isSignup
            ? "Vous avez deja un compte ?"
            : "Vous n'avez pas de compte ?"}
        </p>

        <button
          type="button"
          className="switch-button"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Se connecter" : "S'inscrire"}
        </button>
      </div>
    </div>
  );
}
export default LoginDetail;
