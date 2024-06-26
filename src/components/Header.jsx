import { Link } from "react-router-dom";
import logo from "./../assets/logo-lvf.png";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosLeaf } from "react-icons/io";
import barre_horizontale from "./../assets/barre_horizontale.png";

/**
 *
 * header avec props isLoggedIn pour se logger
 * et props toggleMode pour changer de Mode de visualisation
 */
const Header = ({ isLoggedIn, toggleMode, darkMode }) => {

  /** State du Menu Burger initialisé sur inactive */
  const [openCloseMenuState, setOpenCloseMenuState] = useState("inactive");

  let pathLogged = isLoggedIn ? "/logout" : "/login";
  function logInOutLink(login) {
    if (login) {
      return (
        <>
          <span> Déconnexion</span>
        </>
      );
    } else
      return (
        <>
          <span> Connexion</span>
        </>
      );
  }

  /**
   *
   * Fonction du menu burger avec un ternaire
   * qui change le state au click 
   */
  function openCloseMenu() {
    const classAction =
      openCloseMenuState === "inactive" ? "active" : "inactive";
    console.log(`dans openCloseMenu`, classAction);
    setOpenCloseMenuState(classAction);
  }

  /**
   *
   * menu dropdown
   */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    /* ---------- balise Parent header-------- */
    <header className="header container-fluid pt-1">
      {/* ---------- button ecoview and loggin-------- */}
      <div className="ecoview-login container d-flex flex-row-reverse">
        <ul className="list-unstyled d-flex align-items-center gap-2">
          <li>
            <button className="btn btn-primary">
              <FaUser />
              <Link
                className="loggin text-decoration-none text-white"
                to={pathLogged}
              >
                {isLoggedIn ? logInOutLink(true) : logInOutLink(false)}
              </Link>
            </button>
          </li>

          <li>
            <button className="btn btn-success" onClick={toggleMode}>
              {darkMode === "light" ? (
                <>
                  <IoIosLeaf className="mr-" />
                  Eco View
                </>
              ) : (
                "Defaut View"
              )}
            </button>
          </li>
        </ul>
      </div>

      {/* ----------container logo+navbar --------- */}
      <div className="header-custom container d-flex align-items-center">
        {/* ----------container logo--------- */}
        <div className="logo">
          <Link to={"/"}>
            <img src={logo} alt="Logo vélomobile - retour accueil" />
          </Link>
        </div>

        {/* ----------navbar--------- */}
        {/* L'événements openCloseMneu ferme le menu au click  */}
        <div className="flex-grow-1 d-flex justify-content-end align-item-start">
          <nav id="nav" className={openCloseMenuState}>
            <ul className="list-unstyled d-flex align-items-center gap-3">
              <li className="home-link" onClick={openCloseMenu}>
                <Link to={`/home`}>
                  <span>Home</span>
                </Link>
              </li>
              <li className="products-link" onClick={openCloseMenu}>
                <Link to={`/products`}>
                  <span>VeloMobile</span>
                </Link>
              </li>
              <li className="atelier-link" onClick={openCloseMenu}>
                <Link to={`/atelier`}>
                  <span>Atelier</span>
                </Link>
              </li>

              <li className="history-link" onClick={openCloseMenu}>
                <Link to={`/history`}>
                  <span>Histoire</span>
                </Link>
              </li>

              <li className="showroom-link" onClick={openCloseMenu}>
                <Link to={`/showroom`}>
                  <span>Showroom</span>
                </Link>
              </li>

             <li className="magazine-link nav-item dropdown" onClick={toggleDropdown}>
      <span className="nav-link dropdown-toggle" role="button" aria-haspopup="true" aria-expanded={isDropdownOpen ? "true" : "false"}>
        <Link to="/magazine">Magazine</Link>
      </span>

      <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
        <Link to="/magazine"><span className="dropdown-item">Articles</span></Link>
        <Link to="/article_pluie"><span className="dropdown-item">Article Sous la pluie</span></Link>
        <Link to="/article_trajet_long"><span className="dropdown-item">Article Trajet long</span></Link>
        <Link to="/article_eco"><span className="dropdown-item">Article Écologique</span></Link>
      </div>
    </li>

            </ul>
            {/* Icons de mon hearder.scss */}
            <div id="icons" onClick={openCloseMenu}></div>
          </nav>
        </div>
      </div>
      {/*---------h1-------*/}
      <div className="visually-hidden">
        <h1 className="text-center">Le Velomobile Français</h1>
      </div>
      <br></br>
      {/*---------barre horizontalefr-------*/}
      <div className="d-flex justify-content-center align-items-center">
        <img
          src={barre_horizontale}
          className="img-fluid "
          alt="Responsive image"
        />
      </div>
    </header>
  );
};

export default Header;
