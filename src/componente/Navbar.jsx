import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import InputSearch from "./InputSearch";
import { useCarrinho } from "../context/CarrinhoContext";

export function Navbar() {
  const navigate = useNavigate();
  const { calcularQuantidadeTotal } = useCarrinho();
  const [tema, setTema] = useState("dark");

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema") || "dark";
    setTema(temaSalvo);
    document.documentElement.setAttribute("data-bs-theme", temaSalvo);
  }, []);

  function toggleTheme() {
    const newTheme = tema === "light" ? "dark" : "light";
    setTema(newTheme);
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("tema", newTheme);
  }

  return (
    <nav className="navbar navbar-expand-lg bg-navbar border-bottom eco-border py-2">
      <div className="container-fluid">
        <a
          className="navbar-brand border-0"
          onClick={() => navigate("/home")}
          id="logo"
          style={{ cursor: "pointer" }}
        >
          <img
            src="/LogoMaior.png"
            alt="Eco-nest Logo"
            width="70"
            height="70"
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse w-100"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-2">
            <li className="nav-item">
              <NavLink className={"nav-link"} aria-current="page" to={"/home"}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={"/sobre"}>
                Sobre Nós
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={"/contato"}>
                Contato
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-2 w-100 justify-content-end">
            <li className="nav-item me-3 w-100 d-none d-lg-block" style={{ maxWidth: "400px" }}>
              <InputSearch />
            </li>

            <li className="nav-item">
              <button
                className={
                  tema === "dark"
                    ? "btn btn-outline-warning border-0"
                    : "btn btn-outline-dark border-0"
                }
                onClick={toggleTheme}
                title="Alterar Tema"
              >
                {tema === "dark" ? (
                  <i className="bi bi-brightness-high-fill"></i>
                ) : (
                  <i className="bi bi-moon"></i>
                )}
              </button>
            </li>

            <li className="nav-item">
              <button 
                className="btn btn-outline-eco bg-transparent border-0 position-relative"
                onClick={() => navigate("/carrinho")}
              >
                <i className="bi bi-cart"></i>
                {calcularQuantidadeTotal() > 0 && (
                  <span
                    className={
                      tema === "dark"
                        ? "badge bg-success text-light position-absolute top-0 start-50"
                        : "badge bg-success text-light position-absolute top-0 start-50"
                    }
                  >
                    {calcularQuantidadeTotal()}
                  </span>
                )}
              </button>
            </li>

            <li className="nav-item">
              <Link to={"/"} className="nav-link btn btn-eco">
                Entrar
              </Link>
            </li>
          </ul>

          <div className="d-lg-none mt-2">
            <InputSearch />
          </div>
        </div>
      </div>
    </nav>
  );
}