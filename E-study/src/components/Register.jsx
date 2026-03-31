import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(import.meta.env.VITE_API_URL + "/user/register", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : null;
      console.log(data);

      if (response.ok) {
        if (data?.tokens?.accessToken) {
          localStorage.setItem("token", data.tokens.accessToken);
        }
        navigate("/home");
      } else {
        alert(data?.errors?.[0] || "Erro ao criar conta");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
    }
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

      <button className="register-submit" type="submit">
        Criar Conta
      </button>
      <p>
        Já tem conta? <Link to="/">Login</Link>
      </p>
    </form>
  );
}

export default Register;
