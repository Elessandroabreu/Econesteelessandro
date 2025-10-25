import Card from "./Card";
import { NavbarLogado } from "./NavbarLogado";
import RadioBtn from "./RadioBtn";
import { useState, useEffect } from "react";
import { produtoService } from "../services/produtoService";

export default function HomeLogado() {
  const [listaProd, setListaProd] = useState([]);
  const [listaFiltrado, setFiltrado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Pegar dados do usuário
    const usuarioData = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(usuarioData);

    // Buscar produtos
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const produtos = await produtoService.listarTodos();

      // Converter para formato usado no front
      const produtosFormatados = produtos.map((p) => ({
        cdProduto: p.cdProduto,
        nome: p.nmProduto,
        preco: p.preco,
        categoria: p.categoria,
        img: p.cdProduto
          ? `http://localhost:8084/api/v1/produto/${p.cdProduto}/imagem`
          : "/placeholder.png",
        qtdEstoque: p.qtdEstoque,
      }));

      setListaProd(produtosFormatados);
      setFiltrado(produtosFormatados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      alert("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorCategoria = (categoria) => {
    if (categoria === "todos") {
      setFiltrado(listaProd);
    } else {
      setFiltrado(listaProd.filter((p) => p.categoria === categoria));
    }
  };

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
      <NavbarLogado />
      <main className="container-xxl d-flex flex-column align-items-center w-100 min-vh-100 py-4">
        <h5 className="text-end w-100 mt-2 px-3">
          Bem vindo, {usuario?.nome || "Usuário"}
        </h5>
        
        <nav className="mt-3 d-flex gap-3 h-100 justify-content-center flex-wrap px-3">
          <div onClick={() => filtrarPorCategoria("todos")}>
            <RadioBtn
              name="filtro"
              id="btn-check-todos"
              txt="Todos"
              defaultChecked
            />
          </div>
          <div onClick={() => filtrarPorCategoria("utensilios")}>
            <RadioBtn
              name="filtro"
              id="btn-check-utensilios"
              txt="Utensílios Reutilizáveis"
            />
          </div>
          <div onClick={() => filtrarPorCategoria("casa")}>
            <RadioBtn
              name="filtro"
              id="btn-check-casa"
              txt="Casa Sustentável"
            />
          </div>
          <div onClick={() => filtrarPorCategoria("higiene")}>
            <RadioBtn
              name="filtro"
              id="btn-check-higiene"
              txt="Higiene Pessoal"
            />
          </div>
        </nav>

        <div className="row row-gap-3 justify-content-center w-100 mt-4 px-3">
          {listaFiltrado.length > 0 ? (
            listaFiltrado.map((prod) => (
              <div
                key={`produto-logado-${prod.cdProduto}`}
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
              >
                <Card
                  title={prod.nome}
                  price={prod.preco}
                  desc={prod.categoria}
                  img={prod.img}
                  cdProduto={prod.cdProduto}
                  categoria={prod.categoria}
                  qtdEstoque={prod.qtdEstoque}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center" key="sem-produtos-logado">
              <p className="text-muted">Nenhum produto encontrado nesta categoria</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}