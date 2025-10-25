import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { produtoService } from "../services/produtoService";

export function GerenciarProduto() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const produtosData = await produtoService.listarTodos();
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      alert("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id, nomeProduto) => {
    if (
      window.confirm(
        `Tem certeza que deseja inativar o produto: ${nomeProduto}? Esta ação irá remover o produto da listagem.`
      )
    ) {
      try {
        await produtoService.inativar(id);
        
        // Remover o produto da lista local
        setProdutos(produtos.filter(p => p.cdProduto !== id));
        
        alert("Produto inativado com sucesso!");
      } catch (error) {
        console.error("Erro ao inativar produto:", error);
        alert("Erro ao inativar produto: " + (error.response?.data || error.message));
      }
    }
  };

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nmProduto.toLowerCase().includes(busca.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="container-fluid bg-eco d-flex justify-content-center align-items-center min-vh-100 py-4">
      <div
        className="container bg-body rounded rounded-5 flex-column d-flex py-5 shadow"
        style={{ maxWidth: "850px" }}
      >
        <div className="d-flex justify-content-between align-items-center w-100 mb-4 px-3 flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-voltar border-0 fs-2 rounded-2"
              onClick={() => navigate(-1)}
              title="Voltar ao Menu Administrador"
            >
              <i className="bi bi-arrow-left-short"></i>
            </button>
            <h1 className="text-success fs-4 fw-bold ms-2">
              Gerenciar Produtos
            </h1>
          </div>
        </div>

        <div className="mb-4 w-100 px-3">
          <input
            type="text"
            className="form-control eco-border"
            placeholder="Buscar por Nome ou Categoria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="table-responsive px-3">
          <table className="table table-hover align-middle">
            <thead>
              <tr className="table-light">
                <th>NOME DO PRODUTO</th>
                <th>CATEGORIA</th>
                <th>VALOR</th>
                <th>ESTOQUE</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.cdProduto}>
                  <td>{produto.nmProduto}</td>
                  <td>{produto.categoria}</td>
                  <td>R$ {produto.preco.toFixed(2)}</td>
                  <td>{produto.qtdEstoque}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        handleExcluir(produto.cdProduto, produto.nmProduto)
                      }
                      title="Inativar Produto"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {produtosFiltrados.length === 0 && (
            <p className="text-center text-muted mt-4">
              Nenhum produto encontrado.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}