import { useState, useEffect } from "react";
import { produtoService } from "../services/produtoService";

export default function InputSearch() {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const produtosData = await produtoService.listarTodos();
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const handleBusca = (valor) => {
    setBusca(valor);
    
    if (valor.trim() === "") {
      setFiltro([]);
      return;
    }

    const resultados = produtos
      .filter((prod) =>
        prod.nmProduto.toLowerCase().includes(valor.toLowerCase())
      )
      .slice(0, 4);
    
    setFiltro(resultados);
  };

  return (
    <>
      <form className="d-flex input-group position-relative" role="search">
        <input
          className="form-control border-1 eco-border border-end-0 rounded-start-0 rounded-start-5"
          type="search"
          placeholder="Pesquise o produto desejado"
          aria-label="Search"
          id="input-navbar"
          value={busca}
          onChange={(e) => handleBusca(e.target.value)}
        />
        <button
          className="btn btn-navbar border-1 eco-border border-start-0 input-group-text rounded-end-5"
          type="submit"
          onClick={(e) => e.preventDefault()}
        >
          <i className="bi bi-search"></i>
        </button>
        <ul
          className="position-absolute d-flex flex-column bg-primary p-0 bg-body rounded-2"
          id="resultado-pesquisa"
          style={{ top: "40px", left: "10px", width: "95%", zIndex: 1000 }}
        >
          {filtro.map((prod) => (
            <button
              key={prod.cdProduto}
              className="bg-body border-bottom rounded-2 p-2 resp-result text-start"
              onClick={(e) => {
                e.preventDefault();
                setBusca("");
                setFiltro([]);
              }}
            >
              {prod.nmProduto}
            </button>
          ))}
        </ul>
      </form>
    </>
  );
}