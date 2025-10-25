import { useState, useEffect } from "react";

export default function Card({
  img,
  title,
  desc,
  price,
  badge,
  color = "bg-success",
  border = "border-5 eco-border",
}) {
  const [imagemSrc, setImagemSrc] = useState("/placeholder.png");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (img && img.includes("localhost:8084")) {
      setCarregando(true);
      
      // Tentar carregar a imagem
      fetch(img, {
        headers: {
          'Accept': 'image/jpeg,image/png,image/*'
        }
      })
        .then(response => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error("Erro ao carregar imagem");
        })
        .then(blob => {
          const imageUrl = URL.createObjectURL(blob);
          setImagemSrc(imageUrl);
          setCarregando(false);
        })
        .catch(error => {
          console.error("Erro ao carregar imagem:", error);
          setImagemSrc("/placeholder.png");
          setCarregando(false);
        });
    } else if (img) {
      setImagemSrc(img);
      setCarregando(false);
    }

    // Cleanup: liberar URL quando componente desmontar
    return () => {
      if (imagemSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imagemSrc);
      }
    };
  }, [img]);

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
          className="p-4 d-flex align-items-center justify-content-center"
          style={{
            height: "200px",
            backgroundColor: "#f8f9fa",
            borderRadius: "30px",
            margin: "1rem",
          }}
        >
          {carregando ? (
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          ) : (
            <img
              src={imagemSrc}
              className="w-100 h-100 object-fit-cover"
              alt={title}
              style={{
                borderRadius: "30px",
              }}
              onError={(e) => {
                console.error("Falha ao renderizar imagem");
                e.target.src = "/placeholder.png";
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
            <button className="btn btn-eco px-3">
              <i className="bi bi-cart-plus-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}