import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(email);
    console.log(password);
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

      <button onClick={() => navigate("/home")} className="login-button" type="submit">
        Entrar
      </button >
      <div className="register-link">
        <p className="register-link">
          Não tem conta? <Link to="/register">Registrar</Link>
        </p>
      </div>
    </form>
  );
}

export default Login;
