import api from "./api";

export const authService = {
  login: async (email, senha) => {
    try {
      const response = await api.post("/auth/login", {
        nmEmail: email,
        nmSenha: senha,
      });
      return response.data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  },

  register: async (dados) => {
    try {
      const response = await api.post("/auth/register", {
        nmUsuario: dados.nome,
        nmEmail: dados.email,
        nmSenha: dados.senha,
        nuCpf: dados.cpf,
        dsEndereco: dados.endereco,
        nuTelefone: dados.telefone,
        estado: dados.estado,
      });
      return response.data;
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },

  getUsuarioLogado: () => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      try {
        return JSON.parse(usuarioStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const usuario = authService.getUsuarioLogado();
    return !!(token && usuario);
  },
};