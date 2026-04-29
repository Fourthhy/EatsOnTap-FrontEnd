import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from './src/components/global/Footer';

function AboutLVCC() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <title>Eat's on Tap - About LVCC</title>
      <link href="https://fonts.cdnfonts.com/css/geist" rel="stylesheet" />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @font-face {
            font-family: 'Tolkien';
            src: url('/Tolkien.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            scroll-behavior: smooth;
            overflow-x: hidden;
        }

        .font-tolkien {
            font-family: 'Tolkien', serif !important;
        }

        /* Header (Mobile First) */
        header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.3s ease;
        }

        header.scrolled {
            background: rgba(15, 23, 42, 0.98);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: clamp(12px, 3vw, 20px) clamp(20px, 5vw, 60px);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo-section {
            display: flex;
            align-items: center;
            gap: clamp(10px, 2vw, 16px);
        }

        .logo {
            width: clamp(36px, 6vw, 48px);
            height: clamp(36px, 6vw, 48px);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .brand-text h3 {
            font-size: clamp(14px, 3vw, 18px);
            color: white;
            font-weight: 700;
            margin-bottom: 2px;
            letter-spacing: 0.5px;
        }

        .brand-text p {
            font-size: clamp(10px, 1.5vw, 12px);
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
        }

        nav {
            display: none; /* Hidden on mobile */
            gap: 32px;
            align-items: center;
        }

        nav a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-size: clamp(13px, 1.5vw, 15px);
            font-weight: 500;
            transition: color 0.3s ease;
        }

        nav a:hover {
            color: #60a5fa;
        }

        .btn-home {
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa !important;
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: clamp(10px, 2vw, 13px) clamp(20px, 3vw, 24px);
            border-radius: 20px;
            text-decoration: none;
            font-size: clamp(13px, 1.5vw, 15px);
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
        }

        .btn-home:hover {
            background: #3b82f6 !important;
            color: white !important;
        }

        /* Mobile Menu Overlay */
        .about-mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(15, 23, 42, 0.98);
            backdrop-filter: blur(15px);
            z-index: 999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 30px;
        }

        .about-mobile-menu a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-size: 24px;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .about-mobile-menu a:hover {
            color: white;
        }

        .about-mobile-menu .btn-home {
            margin-top: 20px;
            font-size: 20px;
            padding: 12px 40px;
        }

        .menu-toggle {
            display: flex; /* Visible on mobile */
            flex-direction: column;
            gap: 6px;
            cursor: pointer;
            padding: 8px;
            z-index: 1001;
        }

        .menu-toggle span {
            width: 24px;
            height: 2px;
            background: white;
            transition: all 0.3s ease;
        }

        .menu-toggle.open span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .menu-toggle.open span:nth-child(2) {
            opacity: 0;
        }

        .menu-toggle.open span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }

        /* About Section (Mobile First) */
        .about-section {
            padding: clamp(100px, 20vw, 160px) clamp(16px, 5vw, 60px) clamp(40px, 10vw, 80px);
            max-width: 1400px;
            margin: 0 auto;
            min-height: calc(100vh - 300px);
        }

        .about-container {
            display: flex;
            flex-direction: column; /* Stacked on mobile */
            gap: clamp(30px, 8vw, 60px);
            align-items: stretch;
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(15, 23, 42, 0.3) 100%);
            border-radius: clamp(16px, 4vw, 24px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: clamp(24px, 6vw, 60px);
        }

        .about-visual-container {
            flex: 0 0 auto;
            width: 100%; /* Full width on mobile */
            display: flex;
            margin-top: 0;
            margin-bottom: 0;
        }

        .about-content {
            flex: 1;
        }

        .about-visual {
            width: 100%;
            border-radius: clamp(12px, 3vw, 16px);
            overflow: hidden;
            position: relative;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            aspect-ratio: 16 / 10;
        }

        .about-visual img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-carousel {
            display: flex;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .about-content h1 {
            font-size: clamp(28px, 7vw, 48px);
            background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: clamp(16px, 4vw, 24px);
        }

        .about-content p {
            font-size: clamp(15px, 3.5vw, 18px);
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.8;
            margin-bottom: clamp(16px, 4vw, 24px);
        }

        .about-badge {
            display: inline-block;
            padding: clamp(6px, 1.5vw, 8px) clamp(16px, 4vw, 20px);
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
            border-radius: 20px;
            font-size: clamp(12px, 2.5vw, 14px);
            font-weight: 600;
            margin-bottom: clamp(12px, 3vw, 20px);
        }

        /* Carousel indicator dots */
        .carousel-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: clamp(12px, 3vw, 16px);
        }

        .carousel-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 0;
        }

        .carousel-dot.active {
            background: #3b82f6;
            transform: scale(1.3);
        }

        /* ========================================================================
           RESPONSIVE BREAKPOINTS
           ======================================================================== */

        /* ========== Very small screens (< 375px, e.g. Galaxy Fold) ========== */
        @media (max-width: 374px) {
            .logo {
                width: 32px;
                height: 32px;
            }
            .brand-text h3 {
                font-size: 12px;
            }
        }

        /* ========== 1024px — laptops ========== */
        @media (min-width: 1024px) {
            nav {
                display: flex;
            }
            .menu-toggle {
                display: none;
            }
            .about-container {
                flex-direction: row; /* Side by side on desktop */
            }
            .about-visual-container {
                flex: 0 0 40%;
                margin-top: 56px;
                margin-bottom: 24px;
            }
        }
          `
        }}
      />

      <motion.header
        id="header"
        className={isScrolled ? "scrolled" : ""}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        <div className="header-container">
          <Link to="/" className="logo-section" style={{ textDecoration: 'none' }}>
            <div className="logo">
              <img src="/lv-logo.png" alt="LVCC Logo" />
            </div>
            <div className="brand-text">
              <h3 className="font-tolkien text-white">LA VERDAD CHRISTIAN COLLEGE</h3>
              <p className="font-serif">MacArthur Highway, Sampaloc, Apalit, Pampanga 2016</p>
            </div>
          </Link>
          <nav>
            <Link to="/" className="btn-home">Back to Home</Link>
          </nav>
          <div className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span />
            <span />
            <span />
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="about-mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="btn-home" onClick={closeMenu}>Back to Home</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="about-section">
        <motion.div
          className="about-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-visual-container">
            <Carousel />
          </div>

          <div className="about-content">
            <div className="about-badge">ABOUT LVCC</div>
            <h1 className="font-bold">Empowering Scholars</h1>
            <p>
              La Verdad Christian College (LVCC) is a private, non-stock, non-sectarian educational institution established in Apalit, Pampanga. It stands out uniquely for its remarkable advocacy: providing absolute free quality education to poor and deserving scholars.
            </p>
            <p>
              Recognized as the first private school in the Philippines to grant a completely free college education—which includes devoid tuition, miscellaneous fees, uniform, and meals—LVCC envisions producing not only academically excellent professionals but individuals with strong moral fiber.
            </p>
            <p>
              Driven by the philosophy "Wisdom Based on the Truth is Priceless". La Verdad continues to innovate, digitalize its systems (such as the Eat's on Tap RFID-driven meal claiming solution), and build a holistic environment where students thrive gracefully.
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}

// Simple internal Image Carousel for the about page
function Carousel() {
  const images = [
    "LV1.png",
    "LV2.png",
    "LV3.png"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div className="about-visual">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt="LVCC Campus Highlight"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
          />
        </AnimatePresence>
      </div>
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default AboutLVCC;
