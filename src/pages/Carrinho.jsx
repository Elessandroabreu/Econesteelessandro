import { useCarrinho } from "../context/CarrinhoContext";
import { Navbar } from "../componente/Navbar";
import Footer from "../componente/Footer";
import { useNavigate } from "react-router-dom";

export default function Carrinho() {
  const navigate = useNavigate();
  const {
    itens,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    calcularTotal,
  } = useCarrinho();

  const handleFinalizarCompra = () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      alert("Você precisa estar logado para finalizar a compra");
      navigate("/");
      return;
    }
    navigate("/checkout");
  };

  if (itens.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container min-vh-100 d-flex flex-column justify-content-center align-items-center py-5">
          <i className="bi bi-cart-x" style={{ fontSize: "5rem", color: "#2f5531" }}></i>
          <h2 className="mt-3 eco-text">Seu carrinho está vazio</h2>
          <p className="text-muted">Adicione produtos para continuar comprando</p>
          <button 
            className="btn btn-eco mt-3"
            onClick={() => navigate("/home")}
          >
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
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="eco-text">Meu Carrinho</h1>
              <button 
                className="btn btn-outline-danger"
                onClick={limparCarrinho}
              >
                <i className="bi bi-trash me-2"></i>
                Limpar Carrinho
              </button>
            </div>
            <hr className="eco-border" />
          </div>

          <div className="col-lg-8">
            {itens.map((item) => (
              <div key={item.cdProduto} className="card mb-3 bg-eco">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <img
                        src={item.img}
                        alt={item.nome}
                        className="img-fluid rounded"
                        style={{ maxHeight: "100px", objectFit: "contain" }}
                      />
                    </div>
                    <div className="col-md-4">
                      <h5 className="eco-card-text">{item.nome}</h5>
                      <small className="text-muted">{item.categoria}</small>
                    </div>
                    <div className="col-md-2">
                      <p className="mb-0 fw-bold">
                        R$ {item.preco.toFixed(2)}
                      </p>
                    </div>
                    <div className="col-md-2">
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            atualizarQuantidade(
                              item.cdProduto,
                              item.quantidade - 1
                            )
                          }
                        >
                          -
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
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            atualizarQuantidade(
                              item.cdProduto,
                              item.quantidade + 1
                            )
                          }
                          disabled={item.quantidade >= item.qtdEstoque}
                        >
                          +
                        </button>
                      </div>
                      <small className="text-muted">
                        Estoque: {item.qtdEstoque}
                      </small>
                    </div>
                    <div className="col-md-2 text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removerItem(item.cdProduto)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <p className="mt-2 mb-0 fw-bold">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card bg-eco sticky-top" style={{ top: "20px" }}>
              <div className="card-body">
                <h5 className="card-title eco-card-text">Resumo do Pedido</h5>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>R$ {calcularTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Frete:</span>
                  <span className="text-success">A calcular</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="eco-text">
                    R$ {calcularTotal().toFixed(2)}
                  </strong>
                </div>
                <button
                  className="btn btn-eco w-100"
                  onClick={handleFinalizarCompra}
                >
                  Finalizar Compra
                </button>
                <button
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => navigate("/home")}
                >
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