import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { produtoService } from "../services/produtoService";

export function TelaCadastrarProduto() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome || !descricao || !quantidade || !valor || !categoria) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!imagem) {
      alert("Por favor, selecione uma imagem para o produto");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nmProduto", nome);
      formData.append("dsProduto", descricao);
      formData.append("preco", parseFloat(valor));
      formData.append("categoria", categoria);
      formData.append("qtdEstoque", parseInt(quantidade));
      formData.append("imgProduto", imagem);

      await produtoService.criar(formData);
      
      alert("Produto cadastrado com sucesso!");
      
      // Limpar formulário
      setNome("");
      setDescricao("");
      setQuantidade("");
      setValor("");
      setCategoria("");
      setImagem(null);
      document.getElementById("formFile").value = "";
      
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert(error.response?.data || "Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 10MB");
        e.target.value = "";
        return;
      }
      setImagem(file);
    }
  };

  return (
    <>
      <main className="container-fluid bg-eco border-top border-2 eco-border d-flex justify-content-start align-items-center min-vh-100 py-4">
        <div className="container bg-body rounded rounded-5 flex-column d-flex py-5 px-4">
          <button
            className="btn btn-voltar border-0 fs-2 rounded-2 align-self-start"
            onClick={() => {
              navigate(-1);
            }}
          >
            <i className="bi bi-arrow-left-short"></i>
          </button>
          
          <img
            src="..\public\logoSemFundo.png"
            alt="logo econest"
            className="rounded my-3 align-self-start"
            style={{ width: "70px" }}
          />
          
          <div className="d-flex justify-content-end w-100 mb-3 px-3">
            <Link to={"/GerenciarProduto"}>
              <button className="btn btn-eco" style={{ width: "220px" }}>
                <i className="bi bi-list-task me-2"></i> Gerenciar Produtos
              </button>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset className="row g-3">
              <div className="col-12 d-flex justify-content-between align-items-center mb-3">
                <legend className="text-success mb-0">Cadastrar Produto</legend>
              </div>

              <div className="col-12">
                <input
                  type="text"
                  className="form-control eco-border"
                  placeholder="Nome do produto"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control eco-border"
                  placeholder="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <input
                  type="number"
                  className="form-control eco-border"
                  placeholder="Quantidade em estoque"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <input
                  type="number"
                  className="form-control eco-border"
                  placeholder="Valor do Produto"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <div className="mb-3">
                  <label htmlFor="formFile" className="form-label">
                    Upload da Imagem do Produto *
                  </label>
                  <input
                    className="form-control eco-border"
                    type="file"
                    id="formFile"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  {imagem && (
                    <small className="text-success">
                      Arquivo selecionado: {imagem.name}
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-6">
                <select
                  className="form-select eco-border"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione a Categoria
                  </option>
                  <option value="higiene">Higiene & Cuidados Pessoais</option>
                  <option value="casa">Casa Sustentável</option>
                  <option value="utensilios">
                    Utensílios & Acessórios Reutilizáveis
                  </option>
                </select>
              </div>

              <div className="col-12 col-md-6 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-eco px-5 py-2 fw-bold w-100"
                  disabled={loading}
                >
                  {loading ? "SALVANDO..." : "SALVAR PRODUTO"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </main>
    </>
  );
}