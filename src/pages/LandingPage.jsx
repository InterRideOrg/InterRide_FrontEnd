import React from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import LandingNavbar from "../components/navigation/LandingNavbar";
import "./LandingPage.css";

import heroCar from "../assets/images/hero-car.png";    // 👈
import fbIcon  from "../assets/images/facebook.svg";
import twIcon  from "../assets/images/twitter.svg";
import igIcon  from "../assets/images/instagram.svg";
import logoImg  from "../assets/images/interride-logo-image.svg";
import logoText from "../assets/images/interride-logo-text.svg";

export default function LandingPage() {
  const nav = useNavigate();

  return (
    <>
      <LandingNavbar />

      {/* ---------- HERO ---------- */}
      <section id="hero" className="lp-hero">
        <img
          className="lp-hero__img"
          src={heroCar}
          alt="Taxi hero"
        />

        <div className="lp-hero__content">
          <h1>
            Bienvenido&nbsp;<span>A InterRide</span>
          </h1>
          <p>
            Tu plataforma segura para viajes interprovinciales en Lima. Reserva
            fácilmente, viaja seguro y con conductores verificados.
          </p>

          <div className="lp-hero__btns">
            <button
              className="lp-btn lp-btn--solid"
              onClick={() => nav("/login")}
            >
              Viaja ahora
            </button>

            <button
              className="lp-btn lp-btn--outline"
              onClick={() => nav("/register-driver")}
            >
              Quiero ser conductor
            </button>
          </div>
        </div>
      </section>

      {/* ---------- ABOUT (full-width fondo azul) ---------- */}
      <section id="about" className="lp-about">
        <div className="lp-about__inner">
          <h2>Acerca De Nosotros</h2>
          <p>
            InterRide es una plataforma que ofrece transporte seguro, confiable
            y cómodo para viajes entre provincias, conectando a los usuarios con
            conductores verificados y vehículos adecuados, apostando por la
            tecnología para mejorar la seguridad y eficiencia del transporte.
          </p>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section id="contact" className="lp-contact">
        <h2>Contáctanos</h2>
        <p>
          Para todas las consultas, envíanos un correo electrónico utilizando el
          siguiente formulario.
        </p>

        <form
          className="lp-contact__form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("📨 Mensaje enviado (mock)");
            e.target.reset();
          }}
        >
          <div className="lp-contact__row">
            <input placeholder="Nombre" required />
            <input placeholder="Apellido" required />
            <input type="email" placeholder="E-mail" required />
          </div>

          <textarea rows="6" placeholder="Mensaje" required />

          <button className="lp-btn lp-btn--solid lp-contact__submit">
            Enviar
          </button>
        </form>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="lp-footer">
        {/* ---------- full logo ---------- */}
        <a href="#hero" className="lp-logo">
          {/* Image (river-pin) */}
          <img
            src={logoImg}
            alt="InterRide logo"
            className="lp-logo__img"
          />
          {/* Text svg */}
          <img
            src={logoText}
            alt="InterRide"
            className="lp-logo__text"
          />
        </a>

        <div className="lp-footer__center">
          <p>© 2025 InterRide. Todos los derechos reservados</p>
          <div className="lp-social">
            <a href="#"><img src={fbIcon} alt="Facebook" /></a>
            <a href="#"><img src={twIcon} alt="Twitter" /></a>
            <a href="#"><img src={igIcon} alt="Instagram" /></a>
          </div>
        </div>

        <address className="lp-footer__right">
          <strong>CONTACTO</strong>
          <br />
          +51 987 654 321
          <br />
          interride@inter.com
        </address>
      </footer>
    </>
  );
}
