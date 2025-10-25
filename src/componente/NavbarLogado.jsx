import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputSearch from "./InputSearch";

export function NavbarLogado() {
  const navigate = useNavigate();

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema") || "dark";
    setTema(temaSalvo);
    document.documentElement.setAttribute("data-bs-theme", temaSalvo);
  }, []);

  const [tema, setTema] = useState("dark");
  
  function toggleTheme() {
    const newTheme = tema === "light" ? "dark" : "light";
    setTema(newTheme);
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("tema", newTheme);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-navbar border-bottom eco-border py-2">
      <div className="container-fluid">
        <a
          className="navbar-brand border-0"
          id="logo"
          onClick={() => navigate("/homeLogado")}
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
              <button className="btn btn-outline-eco bg-transparent border-0 position-relative">
                <i className="bi bi-cart"></i>
                <span
                  className={
                    tema === "dark"
                      ? "badge text-light position-absolute top-0 start-50"
                      : "badge text-dark position-absolute top-0 start-50"
                  }
                >
                  {0}
                </span>
              </button>
            </li>

            <li className="nav-item">
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle p-0 border-0"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="/elessandro.jpeg"
                    alt="Perfil"
                    width="50"
                    height="50"
                    className="rounded-circle"
                    style={{ objectFit: "cover" }}
                  />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-danger"
                    >
                      <i className="bi bi-box-arrow-left me-2"></i>
                      Sair
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          {/* Barra de busca para mobile */}
          <div className="d-lg-none mt-2">
            <InputSearch />
          </div>
        </div>
      </div>
    </nav>
  );
}