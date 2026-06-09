import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TogglePassword from "./TogglePassword";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const apiUrl = (import.meta.env.VITE_API_URL || "").trim();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl + "/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : null;
      console.log(data);

      // se login for válido
      if (response.ok) {
        localStorage.setItem("token", data?.tokens?.accessToken || "")
        localStorage.setItem("userName", data?.name || "")
        localStorage.setItem("userEmail", data?.email || email || "")
        navigate("/home");
      } else {
        alert(data?.errors?.[0] || "Email ou senha inválidos");
      }
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="input-group">
        <label>Senha</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          <TogglePassword
            show={showPassword}
            onToggle={togglePasswordVisibility}
            disabled={isSubmitting}
            title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            ariaLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
          />
        </div>
      </div>

      <button className="login-button" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? (
          <span className="submit-loading">
            <span className="submit-spinner" aria-hidden="true" />
            Entrando...
          </span>
        ) : (
          "Entrar"
        )}
      </button>

      <div className="register-link">
        <p>
          Não tem conta? <Link to="/register">Registrar</Link>
        </p>
      </div>
    </form>
  );
}

export default Login;
