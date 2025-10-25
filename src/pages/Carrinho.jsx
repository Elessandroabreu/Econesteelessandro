import { useCarrinho } from "../context/CarrinhoContext";
import { Navbar } from "../componente/Navbar";
import Footer from "../componente/Footer";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useState, useEffect } from "react";

export default function Carrinho() {
  const navigate = useNavigate();
  const {
    itens,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    calcularTotal,
  } = useCarrinho();

  const [usuario, setUsuario] = useState(null);
  const [frete, setFrete] = useState(0);

  const valoresFrete = {
    AC: 35.00, AL: 28.00, AP: 32.00, AM: 40.00, BA: 28.00,
    CE: 27.00, DF: 25.00, ES: 22.00, GO: 23.00, MA: 30.00,
    MT: 26.00, MS: 24.00, MG: 20.00, PA: 33.00, PB: 27.00,
    PR: 18.00, PE: 26.00, PI: 29.00, RJ: 30.00, RN: 28.00,
    RS: 23.00, RO: 34.00, RR: 36.00, SC: 20.00, SP: 25.00,
    SE: 27.00, TO: 31.00
  };

  useEffect(() => {
    const usuarioLogado = authService.getUsuarioLogado();
    setUsuario(usuarioLogado);

    if (usuarioLogado && usuarioLogado.estado) {
      const valorFrete = valoresFrete[usuarioLogado.estado] || 0;
      setFrete(valorFrete);
    }
  }, []);

  const handleFinalizarCompra = () => {
    if (!usuario) {
      alert("Você precisa estar logado para finalizar a compra");
      navigate("/");
      return;
    }
    
    alert("Funcionalidade de checkout em desenvolvimento");
  };

  const subtotal = calcularTotal();
  const total = subtotal + frete;

  if (itens.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container min-vh-100 d-flex flex-column justify-content-center align-items-center py-5">
          <i className="bi bi-cart-x" style={{ fontSize: "5rem", color: "#2f5531" }}></i>
          <h2 className="mt-3 eco-text">Seu carrinho está vazio</h2>
          <p className="text-muted">Adicione produtos para continuar comprando</p>
          <button 
            className="btn btn-eco mt-3 px-5 py-2"
            onClick={() => navigate("/home")}
          >
            <i className="bi bi-bag-plus me-2"></i>
            Ir às Compras
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container-fluid min-vh-100 py-4">
        <div className="container">
          {/* Cabeçalho */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="eco-text mb-0">
                  <i className="bi bi-cart3 me-2"></i>
                  Meu Carrinho
                </h1>
                <button 
                  className="btn btn-outline-danger"
                  onClick={limparCarrinho}
                >
                  <i className="bi bi-trash me-2"></i>
                  Limpar Carrinho
                </button>
              </div>
              <hr className="eco-border mt-3" />
            </div>
          </div>

          <div className="row">
            {/* Lista de Produtos */}
            <div className="col-lg-8">
              {itens.map((item) => (
                <div key={item.cdProduto} className="card bg-eco border-0 shadow-sm mb-3">
                  <div className="card-body p-4">
                    {/* Nome e Categoria */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="eco-card-text mb-1 fw-bold">{item.nome}</h5>
                        <small className="text-muted">
                          <i className="bi bi-tag me-1"></i>
                          {item.categoria}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removerItem(item.cdProduto)}
                        title="Remover item"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>

                    {/* Linha: Preço | Quantidade | Subtotal */}
                    <div className="row align-items-center">
                      <div className="col-4">
                        <small className="text-muted d-block mb-1">Preço unitário</small>
                        <span className="fw-bold eco-text">R$ {item.preco.toFixed(2)}</span>
                      </div>
                      
                      <div className="col-4 text-center">
                        <small className="text-muted d-block mb-2">Quantidade</small>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              const novaQtd = item.quantidade - 1;
                              if (novaQtd > 0) {
                                atualizarQuantidade(item.cdProduto, novaQtd);
                              } else {
                                removerItem(item.cdProduto);
                              }
                            }}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          
                          <button 
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            disabled
                            style={{ minWidth: "50px", cursor: "default" }}
                          >
                            {item.quantidade}
                          </button>
                          
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              const novaQtd = item.quantidade + 1;
                              if (novaQtd <= item.qtdEstoque) {
                                atualizarQuantidade(item.cdProduto, novaQtd);
                              } else {
                                alert("Quantidade máxima em estoque atingida!");
                              }
                            }}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>

                      <div className="col-4 text-end">
                        <small className="text-muted d-block mb-1">Subtotal</small>
                        <span className="fw-bold eco-text fs-5">
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo do Pedido */}
            <div className="col-lg-4">
              <div className="card bg-eco border-0 shadow sticky-top" style={{ top: "20px" }}>
                <div className="card-body p-4">
                  <h5 className="card-title eco-card-text mb-3 fw-bold">
                    <i className="bi bi-receipt me-2"></i>
                    Resumo do Pedido
                  </h5>
                  <hr />
                  
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>
                      <i className="bi bi-cart3 me-1"></i>
                      Subtotal ({itens.reduce((acc, item) => acc + item.quantidade, 0)} itens)
                    </span>
                    <span className="fw-bold">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>
                      <i className="bi bi-truck me-1"></i>
                      Frete
                    </span>
                    <div className="text-end">
                      {usuario ? (
                        <>
                          <span className="fw-bold text-success">R$ {frete.toFixed(2)}</span>
                          <br />
                          <small className="text-muted">{usuario.estado}</small>
                        </>
                      ) : (
                        <span className="text-muted">Faça login</span>
                      )}
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong className="fs-5">
                      <i className="bi bi-currency-dollar me-1"></i>
                      Total
                    </strong>
                    <strong className="eco-text fs-4">R$ {total.toFixed(2)}</strong>
                  </div>

                  {!usuario && (
                    <div className="alert alert-warning py-2 mb-3" role="alert">
                      <small>
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Faça login para calcular o frete
                      </small>
                    </div>
                  )}
                  
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-eco"
                      onClick={handleFinalizarCompra}
                      disabled={!usuario}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Finalizar Compra
                    </button>
                    
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/home")}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Continuar Comprando
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}