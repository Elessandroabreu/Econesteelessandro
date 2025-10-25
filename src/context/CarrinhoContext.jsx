import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CarrinhoContext = createContext();

// Hook personalizado para usar o carrinho
export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  }
  return context;
}

// Componente Provider
export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState(() => {
    // Inicializar estado a partir do localStorage
    const carrinhoSalvo = localStorage.getItem("carrinho");
    if (carrinhoSalvo) {
      try {
        return JSON.parse(carrinhoSalvo);
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        localStorage.removeItem("carrinho");
        return [];
      }
    }
    return [];
  });

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(itens));
  }, [itens]);

  const adicionarItem = useCallback((produto) => {
    setItens((itensAtuais) => {
      const itemExiste = itensAtuais.find(
        (item) => item.cdProduto === produto.cdProduto
      );

      if (itemExiste) {
        // Verificar se não excede o estoque
        if (itemExiste.quantidade >= produto.qtdEstoque) {
          alert("Quantidade máxima em estoque atingida!");
          return itensAtuais;
        }
        
        return itensAtuais.map((item) =>
          item.cdProduto === produto.cdProduto
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      // Adicionar novo produto
      return [...itensAtuais, { ...produto, quantidade: 1 }];
    });
  }, []);

  const removerItem = useCallback((cdProduto) => {
    setItens((itensAtuais) =>
      itensAtuais.filter((item) => item.cdProduto !== cdProduto)
    );
  }, []);

  const atualizarQuantidade = useCallback((cdProduto, novaQuantidade) => {
    console.log("atualizarQuantidade chamada - Produto:", cdProduto, "Nova quantidade:", novaQuantidade);
    
    setItens((itensAtuais) => {
      console.log("Itens atuais:", itensAtuais);
      
      // Se quantidade for 0 ou negativa, remove o item
      if (novaQuantidade <= 0) {
        console.log("Removendo item do carrinho");
        return itensAtuais.filter((item) => item.cdProduto !== cdProduto);
      }

      const novosItens = itensAtuais.map((item) => {
        if (item.cdProduto === cdProduto) {
          console.log("Item encontrado! Estoque:", item.qtdEstoque);
          // Verificar se não excede o estoque
          if (novaQuantidade > item.qtdEstoque) {
            alert("Quantidade máxima em estoque atingida!");
            return item;
          }
          console.log("Atualizando quantidade para:", novaQuantidade);
          return { ...item, quantidade: novaQuantidade };
        }
        return item;
      });
      
      console.log("Novos itens:", novosItens);
      return novosItens;
    });
  }, []);

  const limparCarrinho = useCallback(() => {
    if (window.confirm("Tem certeza que deseja limpar o carrinho?")) {
      setItens([]);
      localStorage.removeItem("carrinho");
    }
  }, []);

  const calcularTotal = useCallback(() => {
    return itens.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );
  }, [itens]);

  const calcularQuantidadeTotal = useCallback(() => {
    return itens.reduce((total, item) => total + item.quantidade, 0);
  }, [itens]);

  const value = {
    itens,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    calcularTotal,
    calcularQuantidadeTotal,
  };

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
}

// Export default para o Provider
export default CarrinhoProvider;