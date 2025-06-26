// src/components/navigation/LandingNavbar.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import "../../pages/LandingPage.css";

import logoImg  from "../../assets/images/interride-logo-image.svg";
import logoText from "../../assets/images/interride-logo-text.svg";

export default function LandingNavbar() {
  return (
    <header className="lp-navbar">
      <div className="lp-navbar__inner">
        {/* ---------- logotipo completo ---------- */}
        <ScrollLink
          to="hero" smooth duration={600} offset={-80} className="lp-logo"
        >
          <img src={logoImg}  alt="InterRide logo" className="lp-logo__img"  />
          <img src={logoText} alt="InterRide"      className="lp-logo__text" />
        </ScrollLink>

        {/* ---------- enlaces y CTAs ---------- */}
        <div className="lp-navwrap">
          <nav className="lp-menu">
            <ScrollLink
              to="hero"
              smooth
              duration={600}
              offset={-80}
              activeClass="active"
            >
              Inicio
            </ScrollLink>

            <ScrollLink
              to="about"
              smooth
              duration={600}
              offset={-80}
              activeClass="active"
            >
              Nosotros
            </ScrollLink>

            <ScrollLink
              to="contact"
              smooth
              duration={600}
              offset={-80}
              activeClass="active"
            >
              Contacto
            </ScrollLink>
          </nav>

          <RouterLink to="/register" className="lp-btn lp-btn--outline">
            Regístrate
          </RouterLink>

          <RouterLink to="/login" className="lp-btn lp-btn--solid">
            Inicia Sesión
          </RouterLink>
        </div>
      </div>
    </header>
  );
}
