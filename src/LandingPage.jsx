import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function LandingPage() {
  // State for header background change and Go-To-Top button visibility
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const faqs = [
    { question: "How do students claim their free meals?", answer: "Students simply tap their registered RFID-enabled school ID at the designated meal stations or canteen terminals. The system will automatically verify eligibility and deduct the required credits." },
    { question: "What should I do if I lose my RFID card?", answer: "Lost cards should be immediately reported to the Administration or PSAS Department. They can deactivate your old ID and link a new one to prevent unauthorized use of your meal credits." },
    { question: "Are the meal credits convertible to cash?", answer: "No, virtual credits are strictly for meal claiming within the campus and reset daily. Unused credits cannot be converted to cash or carried over to the next day." },
    { question: "Who is eligible for the Eat's on Tap system?", answer: "The system is designed for LVCC students who are part of the free meal program. Class Advisers and the Admin Assistant handle the registration of eligible students." },
    { question: "Why RFID and not QR code?", answer: "RFID technology offers superior speed and reliability for high-volume environments like school canteens. Unlike QR codes, RFID allows for instant, tap-and-go transactions without the need for scanning, reducing queues and ensuring a seamless meal claiming experience for students." },
    { question: "What would the students do if the system is down?", answer: "In the event of system outage, the students are required to go to the PSAS department to claim for their temporary coupon by tapping their student ID on the provided RFID Scanner." },
    { question: "How secured the system is?", answer: "Our system is highly secure, combining Google's cryptographic verification with strict @laverdad.edu.ph domain locking to block unauthorized users. It further protects accounts using encrypted passwords, HTTP-only secure cookies, and comprehensive backend activity logging." },
  ];

  const features = [
    { icon: '⚡', title: 'Instant RFID Claiming', desc: 'Students simply tap their ID to claim meals in seconds. No more physical coupons or lengthy verification processes.' },
    { icon: '📊', title: 'Real-Time Analytics', desc: 'Monitor meal distribution with live dashboards, track participation rates, and generate comprehensive reports instantly.' },
    { icon: '🔒', title: 'Secure & Compliant', desc: 'Built with data privacy in mind, fully compliant with RA 10173 (Data Privacy Act of 2012) to protect student information.' },
    { icon: '💰', title: 'Virtual Credit System', desc: 'Automated daily credit allocation with automatic resets. Students can use credits flexibly at meal stations or the canteen.' },
    { icon: '👥', title: 'Multi-User Management', desc: 'Role-based access for PSAS staff, food servers, canteen personnel, and administrators with tailored permissions.' },
    { icon: '📱', title: 'Web-Based Platform', desc: 'Access from any device with a browser. No complex installations, just login and start managing meals efficiently.' }
  ];
  const extendedFeatures = [...features, ...features, ...features];

  const carouselRef = useRef(null);

  // Infinite scroll carousel jump logic
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth } = carouselRef.current;

    const singleSetWidth = scrollWidth / 3;

    if (scrollLeft >= singleSetWidth * 2 - 20) {
      carouselRef.current.scrollTo({ left: scrollLeft - singleSetWidth, behavior: 'instant' });
    } else if (scrollLeft <= 20) {
      carouselRef.current.scrollTo({ left: scrollLeft + singleSetWidth, behavior: 'instant' });
    }
  };

  // Listen for window scroll to trigger the CSS animations you already designed
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      setTimeout(() => {
        carousel.scrollTo({ left: carousel.scrollWidth / 3, behavior: 'instant' });
      }, 100);
      carousel.addEventListener('scroll', handleCarouselScroll);
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (window.scrollY > 500) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (carousel) {
        carousel.removeEventListener('scroll', handleCarouselScroll);
      }
    };
  }, []);

  // Custom scroll function to account for the fixed header height
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
      const headerOffset = 88; // Height of your fixed header
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 392;
      carouselRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Eat's on Tap - LVCC RFID Meal System</title>
      <link href="https://fonts.cdnfonts.com/css/geist" rel="stylesheet" />
      <style
        dangerouslySetInnerHTML={{
          __html:
            `
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
            overflow-x: hidden;
            background: #0a1628;
            scroll-behavior: smooth;
        }

        .font-tolkien {
            font-family: 'Tolkien', serif !important;
        }

        /* Header */
        header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(10, 22, 40, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.3s ease;
        }

        header.scrolled {
            background: rgba(10, 22, 40, 0.98);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
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
            gap: 40px;
            align-items: center;
        }

        nav a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            transition: color 0.3s ease;
            position: relative;
        }

        nav a::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: #60a5fa;
            transition: width 0.3s ease;
        }

        nav a:hover {
            color: white;
        }

        nav a:hover::after {
            width: 100%;
        }

        .header-cta {
            padding: 10px 24px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .header-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .header-cta::after {
            display: none;
        }

        /* Mobile Menu Toggle */
        .menu-toggle {
            display: none;
            flex-direction: column;
            gap: 6px;
            cursor: pointer;
            padding: 8px;
        }

        .menu-toggle span {
            width: 24px;
            height: 2px;
            background: white;
            transition: all 0.3s ease;
        }

        /* Go to Top Button */
        .go-to-top {
            position: fixed;
            bottom: 40px;
            right: 40px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            z-index: 999;
        }

        .go-to-top.visible {
            opacity: 1;
            visibility: visible;
        }

        .go-to-top:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5);
        }

        .go-to-top svg {
            width: 24px;
            height: 24px;
            fill: white;
        }

        /* Hero Section */
        .hero {
            min-height: 100vh;
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            padding-top: 88px;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 50%;
            height: 100%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffffff" opacity="0.03" width="100" height="100"/></svg>');
            background-size: 30px 30px;
        }

        .hero-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 60px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: center;
            position: relative;
            z-index: 1;
        }

        .hero-text h1 {
            font-size: 64px;
            font-weight: 800;
            color: white;
            margin-bottom: 24px;
            line-height: 1.1;
            letter-spacing: -0.02em;
        }

        .hero-text h1 span {
            background: linear-gradient(135deg, #ffffff 0%, #34d399 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-text p {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.85);
            margin-bottom: 40px;
            line-height: 1.7;
        }

        .cta-buttons {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .btn {
            padding: 18px 36px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary {
            background: white;
            color: #1e3a8a;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.15);
            color: white;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.5);
        }

        /* Hero Visual */
        .hero-visual {
            position: relative;
            perspective: 1000px;
        }

        .mockup-container {
            position: relative;
            transform: rotateY(-15deg) rotateX(5deg);
            transition: transform 0.6s ease;
        }

        .mockup-container:hover {
            transform: rotateY(-10deg) rotateX(2deg) scale(1.02);
        }

        .device-frame {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 24px;
            padding: 16px;
            box-shadow: 
                0 50px 100px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .screen {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            aspect-ratio: 16/10;
        }

        .screen img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Floating Card */
        .floating-card {
            position: absolute;
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .card-1 {
            top: -40px;
            left: -60px;
            width: 200px;
        }

        .card-2 {
            bottom: -40px;
            right: -60px;
            width: 180px;
        }

        .stat-number {
            font-size: 36px;
            font-weight: 800;
            color: #1e3a8a;
            margin-bottom: 8px;
        }

        .stat-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 600;
        }

        /* Features Section */
        .features {
            padding: 120px 60px;
            background: linear-gradient(to bottom, #0f172a, rgba(15, 23, 42, 0));
        }

        .features-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .section-header {
            text-align: center;
            margin-bottom: 80px;
        }

        .section-badge {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .section-header h2 {
            font-size: 48px;
            color: white;
            margin-bottom: 20px;
            font-weight: 800;
        }

        .section-header p {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.6);
            max-width: 600px;
            margin: 0 auto;
        }

        /* Features carousel */
        .features-grid {
            position: relative;
            padding: 8px 0;
        }

        .carousel {
            position: relative;
            width: 1144px; /* 3 * 360 + 2 * 32 */
            margin: 0 auto;
            overflow: visible;
        }

        .carousel-viewport {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
        }

        .carousel-viewport::-webkit-scrollbar { display: none; }

        .carousel-track {
            display: flex;
            gap: 32px;
            padding-top: 24px; 
            padding-bottom: 40px; 
        }

        .carousel-track::-webkit-scrollbar { display: none; }

        .carousel-item {
            flex: 0 0 360px; /* fixed width to match screenshot proportions */
            scroll-snap-align: start;
        }

        .feature-card { 
            height: 100%;
        }

        /* Larger card sizing to match provided design */
        .feature-card {
            padding: 56px;
            min-height: 320px;
        }

        .feature-icon {
            width: 72px;
            height: 72px;
            font-size: 36px;
            border-radius: 18px;
            margin-bottom: 32px;
        }

        .feature-card h3 {
            font-size: 28px;
        }

        .carousel-controls {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: -72px;
            right: -72px;
            display: flex;
            justify-content: space-between;
            pointer-events: none; /* allow clicks only on buttons */
            z-index: 10;
        }

        .carousel-button {
            pointer-events: all;
            background: rgba(10,22,40,0.85);
            border: 1px solid rgba(255,255,255,0.06);
            color: white;
            width: 56px;
            height: 56px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.15s ease, background 0.15s ease;
            padding: 0;
            box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }

        .carousel-button:hover { transform: translateY(-4px); background: rgba(10,22,40,0.95); }

        .carousel-button:hover { transform: translateY(-4px); }

        @media (max-width: 1200px) {
            .carousel-item { flex: 0 0 calc((100% - 24px) / 2); }
        }

        @media (max-width: 968px) {
            .carousel-item { flex: 0 0 100%; }
        }

        .feature-card {
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.4) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 56px; /* larger padding */
            min-height: 320px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-8px);
            border-color: rgba(96, 165, 250, 0.3);
        }

        .feature-card:hover::before {
            opacity: 1;
        }

        .feature-icon {
            width: 72px;
            height: 72px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 32px;
            font-size: 36px;
        }

        .feature-card h3 {
            font-size: 28px;
            color: white;
            margin-bottom: 18px;
            font-weight: 700;
        }

        .feature-card p {
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.7;
            font-size: 16px;
        }

        /* How It Works */
        .how-it-works {
            padding: 120px 60px;
            background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
        }

        .steps {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            gap: 60px;
        }

        .step {
            display: grid;
            grid-template-columns: 80px 1fr;
            gap: 40px;
            align-items: start;
        }

        .step-number {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: 800;
            color: white;
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
        }

        .step-content h3 {
            font-size: 28px;
            color: white;
            margin-bottom: 16px;
            font-weight: 700;
        }

        .step-content p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 18px;
            line-height: 1.7;
        }

        /* Stats Section */
        .stats {
            padding: 100px 60px;
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
        }

        .stats-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 60px;
            text-align: center;
        }

        .stat-item h4 {
            font-size: 56px;
            font-weight: 800;
            color: white;
            margin-bottom: 12px;
        }

        .stat-item p {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
        }

        /* CTA Section */
        .cta-section {
            padding: 120px 60px;
            background: #0a1628;
            text-align: center;
        }

        .cta-content {
            max-width: 800px;
            margin: 0 auto;
        }

        .cta-content h2 {
            font-size: 48px;
            color: white;
            margin-bottom: 24px;
            font-weight: 800;
        }

        .cta-content p {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 40px;
        }

        /* FAQ Accordion Styles - 🟢 FIXED */
        .faq-list {
            margin-top: 40px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .faq-item {
            text-align: left;
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.4) 100%);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            overflow: hidden;
            transition: border-color 0.3s ease;
        }
        .faq-item:hover {
            border-color: rgba(96, 165, 250, 0.3);
        }
        .faq-header {
            padding: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            user-select: none;
        }
        .faq-question {
            font-size: 20px;
            font-weight: 500;
            color: white;
            margin: 0;
            padding-right: 20px;
        }
        .faq-icon {
            color: #3b82f6;
            font-size: 24px;
            font-weight: 300;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.1);
        }
        .faq-content {
            /* 🟢 Removed transition, height, and opacity - Framer Motion handles this now */
            padding: 0 24px;
        }
        .faq-answer {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            margin: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 16px;
        }

        /* Contact Section */
        .contact-section {
            padding: 80px 60px;
            max-width: 1400px;
            margin: 0 auto;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .contact-container {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 60px;
            align-items: flex-start;
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(15, 23, 42, 0.3) 100%);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 60px;
        }

        .contact-text h2 {
            font-size: 40px;
            color: white;
            margin-bottom: 20px;
            font-weight: 700;
        }

        .contact-text p {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.6;
            max-width: 90%;
        }

        .contact-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .contact-input {
            width: 100%;
            padding: 16px 20px;
            border-radius: 12px;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 16px;
            font-family: inherit;
            transition: all 0.3s ease;
        }

        .contact-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
            background: rgba(15, 23, 42, 0.8);
        }

        .contact-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }

        textarea.contact-input {
            min-height: 140px;
            resize: vertical;
        }

        .contact-submit {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            align-self: flex-end;
        }

        .contact-submit:hover {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 968px) {
            .contact-container {
                grid-template-columns: 1fr;
                gap: 40px;
                padding: 40px 30px;
            }
            
            .contact-section {
                padding: 60px 30px;
            }
            .contact-text h2 {
                font-size: 32px;
            }
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

        .footer-links a:hover {
            color: #60a5fa;
        }

        .footer-bottom {
            text-align: center;
            padding-top: 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 968px) {
            .header-container {
                padding: 16px 30px;
            }

            nav {
                display: none;
            }

            .menu-toggle {
                display: flex;
            }

            .hero-content {
                grid-template-columns: 1fr;
                gap: 60px;
                padding: 60px 30px;
            }

            .hero-text h1 {
                font-size: 48px;
            }

            .hero-visual {
                order: -1;
            }

            .footer-content {
                grid-template-columns: 1fr;
                gap: 40px;
            }

            .go-to-top {
                bottom: 24px;
                right: 24px;
                width: 48px;
                height: 48px;
            }
        }
    `
        }}
      />
      {/* Header */}
      <motion.header
        id="header"
        className={isScrolled ? "scrolled" : ""}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        <div className="header-container">
          <div className="logo-section">
            <div className="logo">
              <img src="/lv-logo.png" alt="LVCC Logo" />
            </div>
            <div className="brand-text">
              <h3 className="font-tolkien text-white">LA VERDAD CHRISTIAN COLLEGE</h3>
              <p className="font-serif">MacArthur Highway, Sampaloc, Apalit, Pampanga 2016</p>
            </div>
          </div>
          <nav>
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Features</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}>How It Works</a>
            <a href="#stats" onClick={(e) => scrollToSection(e, 'stats')}>Impact</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')}>FAQ</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a>
          </nav>
          <div className="menu-toggle">
            <span />
            <span />
            <span />
          </div>
        </div>
      </motion.header>

      {/* Go to Top Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.div
            className="go-to-top visible"
            id="goToTop"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ y: -4, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4l-8 8h5v8h6v-8h5z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>
              <span>Eat's on Tap</span>
            </h1>
            <p>
              Transform your free meal distribution with RFID technology. Eat's on
              Tap eliminates manual coupons, reduces wait times, and provides
              real-time analytics for La Verdad Christian College.
            </p>
            <div className="cta-buttons">
              <a href="#features" className="btn btn-secondary" onClick={(e) => scrollToSection(e, 'features')}>
                Learn More
              </a>
            </div>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mockup-container">
              <div className="floating-card card-1">
                <div className="stat-number">Zero</div>
                <div className="stat-label">Lost Coupons</div>
              </div>
              <div className="device-frame">
                <div className="screen">
                  <img
                    src="EatsOnTapLandingGIF.gif"
                    alt="LVCC Campus"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="stat-number">100%</div>
                <div className="stat-label">Efficiency</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.2 }}
          >
            <div className="section-badge">KEY FEATURES</div>
            <h2>Built for Efficiency</h2>
            <p>
              Everything you need to modernize your meal distribution system and
              enhance student welfare.
            </p>
          </motion.div>
          <div className="features-grid">
            <div className="carousel">
              <div className="carousel-viewport" id="featuresViewport" ref={carouselRef}>
                <div className="carousel-track">
                  {extendedFeatures.map((feature, i) => (
                    <div className="carousel-item" key={i}>
                      <motion.div
                        className="feature-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: (i % 6) * 0.1 }}
                      >
                        <div className="feature-icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.desc}</p>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="carousel-controls">
                <button
                  className="carousel-button carousel-prev"
                  aria-label="Previous"
                  onClick={() => scrollCarousel('prev')}
                >
                  ‹
                </button>
                <button
                  className="carousel-button carousel-next"
                  aria-label="Next"
                  onClick={() => scrollCarousel('next')}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="features-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-badge">HOW IT WORKS</div>
            <h2>Three Simple Steps</h2>
            <p>
              From registration to meal claiming, the process is designed to be
              seamless and efficient.
            </p>
          </motion.div>
          <div className="steps">
            <motion.div
              className="step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Student Eligibility Registration</h3>
                <p>
                  Class Advisers and Admin Assistant register eligible students in
                  the system. RFID tags are integrated with existing student IDs for
                  seamless identification.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Tap to Claim</h3>
                <p>
                  Students tap their RFID-enabled ID at the designted meal stations or the
                  canteen. The system instantly verifies eligibility and deducts the
                  appropriate credit amount.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Automatic Recording</h3>
                <p>
                  All transactions are recorded in real-time. PSAS Department can access
                  comprehensive reports and analytics.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats">
        <div className="stats-grid">
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4>8 hrs</h4>
            <p>Saved Daily</p>
          </motion.div>
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4>Zero</h4>
            <p>Lost Coupons</p>
          </motion.div>
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4>2,343</h4>
            <p>Students Served</p>
          </motion.div>
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4>100%</h4>
            <p>Digital</p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">FAQ</div>
          <h2>Frequently Asked Questions</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '40px' }}>
            Everything you need to know about the Eat's on Tap RFID meal system.
          </p>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`faq-item ${openFaq === index ? 'active' : ''}`}
                layout="size" // 🟢 1. Added layout="size" 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="faq-header" onClick={() => toggleFaq(index)}>
                  <h3 className="faq-question">{faq.question}</h3>
                  <motion.div
                    className="faq-icon"
                    animate={{ rotate: openFaq === index ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >+</motion.div>
                </div>
                
                <AnimatePresence initial={false}> {/* 🟢 2. Added initial={false} */}
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                          height: "auto", 
                          opacity: 1,
                          transition: {
                              height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }, // 🟢 3. Smoother Curve
                              opacity: { duration: 0.25, delay: 0.1 }
                          }
                      }}
                      exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: {
                              height: { duration: 0.3 },
                              opacity: { duration: 0.1 }
                          }
                      }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="faq-content" style={{ paddingBottom: '24px' }}> {/* 🟢 4. Inner padding wrapper */}
                        <p className="faq-answer">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <motion.div
          className="contact-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="contact-text">
            <div className="section-badge">CONTACT US</div>
            <h2>Ask us anything!</h2>
            <p>
              Have a question about Eat's on Tap, or want to know more about how we digitize student meals? Drop us a message and our team will get back to you shortly.
            </p>
          </div>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <motion.input
              type="email"
              className="contact-input"
              placeholder="Your Email Address"
              required
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
            <motion.textarea
              className="contact-input"
              placeholder="Type your inquiry here..."
              required
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            ></motion.textarea>
            <motion.button
              type="submit"
              className="contact-submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
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
            <Link to="/about" style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', marginBottom: '12px' }}>LVCC</Link>
            <Link to="/team" style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', marginBottom: '12px' }}>Team</Link>
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
    </>
  );
}

export default LandingPage;