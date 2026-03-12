import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(name, email, password);
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Nome</label>

        <input
          type="text"
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

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
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Link to="/home">
        <button className="register-submit" type="submit">
          Criar Conta
        </button>
      </Link>
      <p>
        Já tem conta? <Link to="/">Login</Link>
      </p>
    </form>
  );
}

export default Register;
