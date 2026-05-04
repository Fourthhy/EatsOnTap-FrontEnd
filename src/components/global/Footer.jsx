import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (e, sectionId) => {
    // If not on landing page, let the standard link behavior take over or redirect to landing page
    if (location.pathname !== '/') {
       navigate(`/#${sectionId}`);
       return;
    }
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
      const headerOffset = 88;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="main-footer"
    >
      <motion.div
        className="footer-content"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="footer-brand">
          <h3>Eat's on Tap</h3>
          <p>
            An RFID-Driven Solution for the Digitalization of Student's Free Meal
            Claiming at La Verdad Christian College, Inc. Apalit, Pampanga.
          </p>
        </div>
        <div className="footer-links">
          <h4>Product</h4>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Features</a>
          <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}>How It Works</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact Us</a>
        </div>
        <div className="footer-links">
          <h4>About</h4>
          <Link to="/about">LVCC</Link>
          <Link to="/team">Team</Link>
          <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')}>FAQ</a>
        </div>
      </motion.div>
      <div className="footer-bottom">
        <p>
          © 2025-26 La Verdad Christian College, Inc. All rights reserved. |
          Developed by BSIS 4 - TEAM 4
        </p>
      </div>
    </motion.footer>
  );
}

export default Footer;
