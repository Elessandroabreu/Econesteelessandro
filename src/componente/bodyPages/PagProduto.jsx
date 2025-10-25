import { useSearchParams } from "react-router-dom";
import { Navbar } from "../Navbar";
import Card from "../Card";
import Footer from "../Footer";

export default function PagProduto() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const listaProdParam = searchParams.get("listaProd");
  
  let listaProd = [];
  
  try {
    if (listaProdParam) {
      listaProd = JSON.parse(decodeURIComponent(listaProdParam));
    }
  } catch (error) {
    console.error("Erro ao decodificar lista de produtos:", error);
  }

  return (
    <>
      <Navbar />

      <div className="container my-4 min-vh-100">
        <h1 className="text-center mb-4 eco-text">{title || "Produtos"}</h1>

        {listaProd.length > 0 ? (
          <div className="row flex-wrap g-4 justify-content-center">
            {listaProd.map((p) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.cdProduto}>
                <Card
                  img={p.img}
                  title={p.nome}
                  desc={p.categoria}
                  price={p.preco}
                  badge=""
                  color="bg-success"
                  border="border-5 eco-border"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted fs-5">
              Nenhum produto encontrado nesta categoria
            </p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}