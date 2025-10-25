import InputOutline from "../InputOutline";
import { BotaoTrocaLogin } from "../BotaoTrocaLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../Toast";
import { authService } from "../../services/authService";

export function FormLogin({ trocaLogin }) {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(email, senha);

      // Salvar dados no localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: response.cdUsuario,
          nome: response.nmUsuario,
          email: response.nmEmail,
          roles: response.roles,
          estado: response.estado,
        })
      );

      // Verificar se é admin
      if (response.roles && response.roles.includes("ADMIN")) {
        navigate("/adm");
      } else {
        navigate("/homeLogado");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      const mensagem = error.response?.data || "Email ou senha inválidos";
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid d-flex flex-lg-row flex-column flex-wrap justify-content-center align-items-center">
        <div className="col-md-4 border border-1 border-secundary p-5">
          <h3 className="text-center mb-4 eco-text">Faça o seu Login</h3>

          {erro && (
            <div className="alert alert-danger" role="alert">
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <InputOutline
              type="email"
              placeholder="Email"
              icon={<i className="bi bi-envelope-at"></i>}
              inputValue={email}
              inputFunction={setEmail}
            />
            <InputOutline
              type="password"
              placeholder="Senha"
              icon={<i className="bi bi-lock"></i>}
              inputValue={senha}
              inputFunction={setSenha}
            />

            <button
              className="btn btn-eco w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ENTRANDO...
                </>
              ) : (
                "ENTRAR"
              )}
            </button>
            <BotaoTrocaLogin trocaLogin={trocaLogin} text="Cadastro" />
          </form>
        </div>
      </div>
    </>
  );
}