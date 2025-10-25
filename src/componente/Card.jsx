import { useState, useEffect } from "react";
import { useCarrinho } from "../context/CarrinhoContext";

export default function Card({
  img,
  title,
  desc,
  price,
  badge,
  color = "bg-success",
  border = "border-5 eco-border",
  cdProduto,
  categoria,
  qtdEstoque,
}) {
  const { adicionarItem } = useCarrinho();
  const [imagemSrc, setImagemSrc] = useState("/placeholder.svg");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let objectUrl = null;
    
    if (img && img.includes("localhost:8084")) {
      setCarregando(true);
      
      const token = localStorage.getItem("token");
      const headers = {
        'Accept': 'image/jpeg,image/png,image/*'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      fetch(img, { headers })
        .then(response => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error("Erro ao carregar imagem");
        })
        .then(blob => {
          objectUrl = URL.createObjectURL(blob);
          setImagemSrc(objectUrl);
          setCarregando(false);
        })
        .catch(error => {
          console.error("Erro ao carregar imagem:", error);
          setImagemSrc("/placeholder.svg");
          setCarregando(false);
        });
    } else if (img) {
      setImagemSrc(img);
      setCarregando(false);
    } else {
      setImagemSrc("/placeholder.svg");
      setCarregando(false);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [img]);

  const handleAdicionarCarrinho = () => {
    const produto = {
      cdProduto,
      nome: title,
      preco: typeof price === "number" ? price : parseFloat(price),
      categoria,
      img: imagemSrc,
      qtdEstoque
    };
    
    adicionarItem(produto);
    
    // Mostrar toast de confirmação
    const toast = document.getElementById("toast-carrinho");
    if (toast) {
      const bsToast = new window.bootstrap.Toast(toast);
      bsToast.show();
    }
  };

  return (
    <>
      <div
        className={`card border ${border} bg-eco position-relative`}
        style={{
          width: "100%",
          maxWidth: "18rem",
          minHeight: "26rem",
          maxHeight: "30rem",
        }}
      >
        {badge && (
          <div
            className={`badge ${color} position-absolute p-2`}
            style={{ top: "-3%", right: "-10%", zIndex: 10 }}
          >
            {badge}
          </div>
        )}

        <div
          className="p-2 d-flex align-items-center justify-content-center"
          style={{
            height: "250px",
            backgroundColor: "#f8f9fa",
            borderRadius: "20px",
            margin: "1rem",
            overflow: "hidden",
          }}
        >
          {carregando ? (
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          ) : (
            <img
              src={imagemSrc}
              className="w-100 h-100"
              alt={title}
              style={{
                borderRadius: "20px",
                objectFit: "contain",
              }}
              onError={(e) => {
                console.error("Falha ao renderizar imagem");
                e.target.src = "/placeholder.svg";
              }}
            />
          )}
        </div>

        <div className="card-body px-4 d-flex flex-column">
          <h5 className="card-title eco-card-text text-center">{title}</h5>
          <p className="card-text eco-card-text text-center flex-grow-1">
            {desc}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <h5 className="card-text fw-bolder eco-card-text mb-0">
              R$ {typeof price === "number" ? price.toFixed(2) : price}
            </h5>
            <button 
              className="btn btn-eco px-3"
              onClick={handleAdicionarCarrinho}
              disabled={qtdEstoque <= 0}
              title={qtdEstoque <= 0 ? "Produto sem estoque" : "Adicionar ao carrinho"}
            >
              <i className="bi bi-cart-plus-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}