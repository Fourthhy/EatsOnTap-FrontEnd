import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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
        }

        .font-tolkien {
            font-family: 'Tolkien', serif !important;
        }

        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 60px;
            transition: all 0.3s ease;
        }

        header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            background: transparent;
            transition: all 0.3s ease;
        }

        header.scrolled {
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-section {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .logo {
            width: 48px;
            height: 48px;
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
            font-size: 18px;
            color: white;
            font-weight: 700;
            margin-bottom: 2px;
            letter-spacing: 0.5px;
        }

        .brand-text p {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
        }

        nav {
            display: flex;
            gap: 32px;
        }

        nav a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-size: 15px;
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
            padding: 10px 24px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
        }

        .btn-home:hover {
            background: #3b82f6 !important;
            color: white !important;
        }

        /* About Section */
        .about-section {
            padding: 160px 60px 80px;
            max-width: 1400px;
            margin: 0 auto;
            min-height: calc(100vh - 300px);
        }

        .about-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(15, 23, 42, 0.3) 100%);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 60px;
        }

        .about-visual {
            width: 100%;
            aspect-ratio: 4/3;
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
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

        .carousel-dots {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 10;
        }

        .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .dot.active {
            background: #3b82f6;
            transform: scale(1.2);
        }

        .about-content h1 {
            font-size: 48px;
            background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 24px;
        }

        .about-content p {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.8;
            margin-bottom: 24px;
        }

        .about-badge {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        /* Footer */
        footer {
            padding: 60px 60px 40px;
            background: #0f172a;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-content {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 60px;
            margin-bottom: 40px;
        }

        .footer-brand h3 {
            font-size: 24px;
            color: white;
            margin-bottom: 16px;
        }

        .footer-brand p {
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.7;
        }

        .footer-links h4 {
            color: white;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 600;
        }

        .footer-links a {
            display: block;
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            margin-bottom: 12px;
            transition: color 0.3s ease;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
        }

        @media (max-width: 968px) {
            .about-container {
                grid-template-columns: 1fr;
                gap: 40px;
                padding: 40px 30px;
            }
            .about-section {
                padding: 120px 30px 60px;
            }
            nav {
                display: none;
            }
            .footer-content {
                grid-template-columns: 1fr;
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
            <Carousel />
          </div>

          <div className="about-content">
            <div className="about-badge">ABOUT LVCC</div>
            <h1>Empowering Scholars</h1>
            <p>
              La Verdad Christian College (LVCC) is a private, non-stock, non-sectarian educational institution established in Apalit, Pampanga. It stands out uniquely for its remarkable mission: providing absolute free quality education to deserving scholars.
            </p>
            <p>
              Recognized as the first private school in the Philippines to grant a completely free college education—which includes devoid tuition, miscellaneous fees, uniform, and meals—LVCC envisions producing not only academically excellent professionals but individuals with strong moral fiber.
            </p>
            <p>
              Driven by the philosophy "The Truth Shall Make You Free," La Verdad continues to innovate, streamline its systems (such as the Eat's on Tap RFID meal claims), and build a holistic environment where students thrive gracefully.
            </p>
          </div>
        </motion.div>
      </section>

      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Eat's on Tap</h3>
            <p>
              An RFID-Driven Solution for the Digitalization of Student's Free Meal
              Claiming at La Verdad Christian College, Inc. Apalit, Pampanga.
            </p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <Link to="/">Features</Link>
            <Link to="/">How It Works</Link>
            <a href="/#contact">Contact Us</a>
          </div>
          <div className="footer-links">
            <h4>About</h4>
            <Link to="/about">LVCC</Link>
            <Link to="/team">Team</Link>
            <Link to="/">FAQ</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © 2025-26 La Verdad Christian College, Inc. All rights reserved. |
            Developed by BSIS 4 - TEAM 4
          </p>
        </div>
      </motion.footer>
    </>
  );
}

// Simple internal Image Carousel for the about page
function Carousel() {
  const images = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/La_Verdad_Christian_College.jpg/800px-La_Verdad_Christian_College.jpg",
    "https://fastly.4sqi.net/img/general/600x600/18868984_Fj2j-i-S1n8jO_4n0_aB3B__hL__X--O_A__j_B-9a0.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/ab/LVCC_Facade.JPG"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
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
      <div className="carousel-dots">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${currentIndex === idx ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label="Image indicator"
          />
        ))}
      </div>
    </div>
  );
}

export default AboutLVCC;
