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

  // Valores de frete por estado (mesmos do enum Estado no back-end)
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
    
    // Aqui você pode adicionar a lógica de checkout
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
      <main className="container min-vh-100 py-5">
        <div className="row">
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
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

          <div className="col-lg-8">
            {itens.map((item) => (
              <div key={item.cdProduto} className="card mb-3 bg-eco border-0 shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center g-3">
                    <div className="col-12 col-md-2 text-center">
                      <img
                        src={item.img}
                        alt={item.nome}
                        className="img-fluid rounded"
                        style={{ maxHeight: "100px", objectFit: "contain" }}
                      />
                    </div>
                    
                    <div className="col-12 col-md-3">
                      <h5 className="eco-card-text mb-1">{item.nome}</h5>
                      <small className="text-muted">
                        <i className="bi bi-tag me-1"></i>
                        {item.categoria}
                      </small>
                    </div>
                    
                    <div className="col-6 col-md-2 text-center">
                      <small className="text-muted d-block">Preço unitário</small>
                      <p className="mb-0 fw-bold eco-text">
                        R$ {item.preco.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="col-6 col-md-3">
                      <small className="text-muted d-block mb-1">Quantidade</small>
                      <div className="input-group input-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            atualizarQuantidade(
                              item.cdProduto,
                              item.quantidade - 1
                            )
                          }
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantidade}
                          onChange={(e) =>
                            atualizarQuantidade(
                              item.cdProduto,
                              parseInt(e.target.value) || 1
                            )
                          }
                          min="1"
                          max={item.qtdEstoque}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            atualizarQuantidade(
                              item.cdProduto,
                              item.quantidade + 1
                            )
                          }
                          disabled={item.quantidade >= item.qtdEstoque}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <small className="text-muted">
                        <i className="bi bi-box-seam me-1"></i>
                        Estoque: {item.qtdEstoque}
                      </small>
                    </div>
                    
                    <div className="col-12 col-md-2 text-center">
                      <small className="text-muted d-block">Subtotal</small>
                      <p className="mb-2 fw-bold eco-text fs-5">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </p>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removerItem(item.cdProduto)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card bg-eco border-0 shadow sticky-top" style={{ top: "20px" }}>
              <div className="card-body">
                <h5 className="card-title eco-card-text mb-3">
                  <i className="bi bi-receipt me-2"></i>
                  Resumo do Pedido
                </h5>
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <i className="bi bi-cart3 me-1"></i>
                    Subtotal ({itens.reduce((acc, item) => acc + item.quantidade, 0)} itens):
                  </span>
                  <span className="fw-bold">R$ {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <i className="bi bi-truck me-1"></i>
                    Frete:
                  </span>
                  <span className={usuario ? "text-success fw-bold" : "text-muted"}>
                    {usuario ? (
                      <>
                        R$ {frete.toFixed(2)}
                        <small className="d-block text-muted" style={{ fontSize: "0.75rem" }}>
                          {usuario.estado} - Santa Catarina
                        </small>
                      </>
                    ) : (
                      "Faça login"
                    )}
                  </span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-3">
                  <strong className="fs-5">
                    <i className="bi bi-currency-dollar me-1"></i>
                    Total:
                  </strong>
                  <strong className="eco-text fs-4">
                    R$ {total.toFixed(2)}
                  </strong>
                </div>

                {!usuario && (
                  <div className="alert alert-warning" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <small>Faça login para calcular o frete e finalizar a compra</small>
                  </div>
                )}
                
                <button
                  className="btn btn-eco w-100 mb-2 py-2"
                  onClick={handleFinalizarCompra}
                  disabled={!usuario}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Finalizar Compra
                </button>
                
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => navigate("/home")}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}