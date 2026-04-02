import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const apiUrl = (import.meta.env.VITE_API_URL || "").trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      if (response.ok && data?.tokens?.accessToken) {
      localStorage.removeItem("token");

      localStorage.setItem("token", data.tokens.accessToken);
      localStorage.setItem("userName", data.name || "");

  navigate("/home");
} else {
  alert("Erro ao autenticar usuário");
}
    } catch (error) {
      console.error("Erro no login:", error);
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
        />
      </div>

      <div className="input-group">
        <label>Senha</label>
        <input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="login-button" type="submit">
        Entrar
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
