import { Navbar } from "../Navbar";
import CardBadge from "../CardBadge";
import Footer from "../Footer";
import CardPropaganda from "../CardPropaganda";
import Banner from "../Banner";
import Card from "../Card";
import { useEffect, useState, useCallback } from "react";
import Toast from "../Toast";
import { useNavigate } from "react-router-dom";
import { produtoService } from "../../services/produtoService";

export default function HomeUsuario() {
  const navigate = useNavigate();
  const [listaProd, setListaProd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const mostrarToast = useCallback((msg) => {
    const toast = document.getElementById("toast");
    if (toast) {
      const bsToast = new window.bootstrap.Toast(toast);
      setToastMessage(msg);
      bsToast.show();
    }
  }, []);

  const carregarProdutos = useCallback(async () => {
    try {
      setLoading(true);
      const produtos = await produtoService.listarTodos();

      const produtosFormatados = produtos.map((p) => ({
        cdProduto: p.cdProduto,
        nome: p.nmProduto,
        preco: p.preco,
        categoria: p.categoria,
        img: `http://localhost:8084/api/v1/produto/${p.cdProduto}/imagem`,
        qtdEstoque: p.qtdEstoque,
      }));

      setListaProd(produtosFormatados);

      if (produtosFormatados.length === 0) {
        mostrarToast("Nenhum produto disponível no momento");
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      mostrarToast("Erro ao carregar produtos");
      setListaProd([]);
    } finally {
      setLoading(false);
    }
  }, [mostrarToast]);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const paginaProd = useCallback((title, categoria) => {
    const query = new URLSearchParams();
    query.set("title", title);
    const listaFiltrada = listaProd.filter(
      (prod) => prod.categoria === categoria
    );
    query.set("listaProd", encodeURIComponent(JSON.stringify(listaFiltrada)));
    navigate(`/pagProduto?${query.toString()}`);
  }, [listaProd, navigate]);

  const destaque = listaProd.slice(0, 4);

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
    <>
      <header>
        <Navbar />
      </header>
      <main className="container-fluid p-0 d-flex flex-column align-items-center justify-content-center overflow-x-hidden">
        <Banner link={"/Banner1.png"} />

        <div className="row d-flex flex-wrap row-gap-4 my-5 mx-3">
          {destaque.length > 0 ? (
            destaque.map((prod) => (
              <div
                className="col-12 col-sm-6 col-md-6 col-lg-3"
                key={`destaque-${prod.cdProduto}`}
              >
                <Card
                  img={prod.img}
                  title={prod.nome}
                  badge={"PROMOÇÃO"}
                  desc={prod.categoria}
                  price={prod.preco}
                  border={"border-0"}
                  cdProduto={prod.cdProduto}
                  categoria={prod.categoria}
                  qtdEstoque={prod.qtdEstoque}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center" key="sem-destaque">
              <p className="text-muted">
                Nenhum produto em destaque no momento
              </p>
            </div>
          )}
        </div>

        <Banner link={"/ProdutosEcologicos.png"} />

        <div className="row row-gap-4 my-5 flex-wrap align-items-center justify-content-center">
          <CardPropaganda
            key="propaganda-higiene"
            text={"Higiene & Cuidados Pessoais"}
            img={"/Bucha.jpeg"}
            onClick={() =>
              paginaProd("Higiene & Cuidados Pessoais", "higiene")
            }
          />

          <CardPropaganda
            key="propaganda-casa"
            text={"Casa Sustentáveis"}
            img={"/CasaSustentaveis.png"}
            onClick={() => paginaProd("Casa Sustentáveis", "casa")}
          />

          <CardPropaganda
            key="propaganda-utensilios"
            text={"Utensílios & Acessórios Reutilizáveis"}
            img={"/Utensilios.png"}
            onClick={() => paginaProd("Utensílios", "utensilios")}
          />
        </div>

        <div className="row justify-content-center">
          <button
            className="btn btn-eco p-4 w-auto px-5 row-gap-4 mb-5"
            onClick={() => navigate("/")}
          >
            Comprar agora
          </button>
        </div>

        <Banner link={"/Banner3.png"} />

        <div className="d-flex flex-column bg-body gap-3 mt-4 ms-3 px-3">
          <h1>Conheça a Eco-nest</h1>
          <p className="text-wrap">
            O lugar certo para quem busca um estilo de vida mais consciente e
            sustentável. Aqui você encontra produtos ecológicos que fazem a
            diferença no dia a dia e ajudam a construir um futuro mais verde.
          </p>
        </div>

        <div className="d-flex w-100 justify-content-center my-4">
          <button className="btn btn-eco w-auto px-5 py-3 fw-semibold fs-5">
            Conheça todos os nossos Produtos
          </button>
        </div>

        <div className="row flex-wrap gap-2 align-items-center justify-content-center my-5">
          <CardBadge key="badge-1" text={"Gestos simples transformam grandes realidades."} />
          <CardBadge key="badge-2" text={"Pequenas mudanças geram grandes impactos."} />
          <CardBadge
            key="badge-3"
            text={"Conheça nossos produtos e faça parte desse movimento"}
          />
        </div>
      </main>
      <Toast msg={toastMessage} color="bg-danger" />
      
      {/* Toast para adicionar ao carrinho */}
      <div
        className="toast align-items-center bg-success text-white position-fixed bottom-0 end-0 mb-3 me-3"
        role="alert"
        id="toast-carrinho"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">
            <i className="bi bi-check-circle me-2"></i>
            Produto adicionado ao carrinho!
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
      
      <Footer />
    </>
  );
}