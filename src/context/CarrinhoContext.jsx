import { createContext, useContext, useState, useEffect } from "react";

const CarrinhoContext = createContext();

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  }
  return context;
}

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem("carrinho");
    if (carrinhoSalvo) {
      try {
        setItens(JSON.parse(carrinhoSalvo));
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        localStorage.removeItem("carrinho");
      }
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(itens));
  }, [itens]);

  const adicionarItem = (produto) => {
    setItens((itensAtuais) => {
      const itemExiste = itensAtuais.find(
        (item) => item.cdProduto === produto.cdProduto
      );

      if (itemExiste) {
        return itensAtuais.map((item) =>
          item.cdProduto === produto.cdProduto
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...itensAtuais, { ...produto, quantidade: 1 }];
    });
  };

  const removerItem = (cdProduto) => {
    setItens((itensAtuais) =>
      itensAtuais.filter((item) => item.cdProduto !== cdProduto)
    );
  };

  const atualizarQuantidade = (cdProduto, quantidade) => {
    if (quantidade <= 0) {
      removerItem(cdProduto);
      return;
    }

    setItens((itensAtuais) =>
      itensAtuais.map((item) =>
        item.cdProduto === cdProduto ? { ...item, quantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const calcularTotal = () => {
    return itens.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );
  };

  const calcularQuantidadeTotal = () => {
    return itens.reduce((total, item) => total + item.quantidade, 0);
  };

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        calcularTotal,
        calcularQuantidadeTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}