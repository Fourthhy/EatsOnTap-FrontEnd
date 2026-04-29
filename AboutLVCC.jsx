import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from './src/components/global/Footer';

function AboutLVCC() {
  const [isScrolled, setIsScrolled] = useState(false);

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
            position: relative;
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

        /* Badge — identical to .section-badge in LandingPage */
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

        /* Mobile badge — hidden on desktop */
        .about-badge-mobile {
            display: none;
        }

        /* Carousel dots — hidden for both views */
        .carousel-dots {
            display: none;
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

        /* ========== Mobile only (< 1024px) ========== */
        @media (max-width: 1023px) {
            /* Hide the burger/back button completely on mobile */
            .menu-toggle { display: none !important; }
            nav { display: none !important; }

            /* Stack badge above carousel, centred */
            .about-visual-container {
                flex-direction: column;
                align-items: center;
            }

            /* Hide desktop badge, show mobile badge centred above carousel */
            .about-badge-desktop { display: none; }
            .about-badge-mobile { display: inline-block; margin-bottom: 16px; }
        }

        /* ========== 1024px — laptops ========== */
        @media (min-width: 1024px) {
            nav { display: flex; }
            .about-container { flex-direction: row; }
            .about-visual-container {
                flex: 0 0 40%;
                flex-direction: row;
                align-items: stretch;
                margin-top: 56px;
                margin-bottom: 24px;
            }
            .about-badge-desktop { display: inline-block; }
            .about-badge-mobile { display: none !important; }
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
        </div>
      </motion.header>

      <section className="about-section">
        <motion.div
          className="about-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-visual-container">
            {/* Mobile badge — centred above carousel */}
            <span className="about-badge about-badge-mobile">ABOUT LVCC</span>
            <Carousel />
          </div>

          <div className="about-content">
            {/* Desktop badge — normal flow above heading */}
            <div className="about-badge about-badge-desktop">ABOUT LVCC</div>
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

// Simple internal Image Carousel — auto-plays, no dots, no manual controls
function Carousel() {
  const images = ["LV1.png", "LV2.png", "LV3.png"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="about-visual" style={{ width: '100%' }}>
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt="LVCC Campus Highlight"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </AnimatePresence>
    </div>
  );
}

export default AboutLVCC;