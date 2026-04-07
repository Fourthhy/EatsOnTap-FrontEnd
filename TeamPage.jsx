import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function TeamPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      id: '1',
      name: 'Aerrol Kyle Santos',
      role: 'Project Manager',
      image: 'PM.png',
      description: "Oversees the project from start to finish, ensuring it stays on track, within budget, and aligned with requirements. Maintains quality standards and serves as the central point of communication among team members.",
      socials: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      id: '2',
      name: 'John Miguel Mañabo',
      role: 'Full-Stack Developer',
      image: 'DEV.png',
      description: 'Leads the technical development and implementation of the system, handling coding, building key features, and ensuring all components function as intended.',
      socials: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      id: '3',
      name: 'Roylyn Joy Dicdican',
      role: 'UI/UX Designer',
      image: 'UI.jpg',
      description: 'Designs the system’s visual interface and overall look, ensuring it meets requirements and delivers a high-quality user experience.',
      socials: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      id: '4',
      name: 'Mark Joseph Santos',
      role: 'Quality Assurance',
      image: 'SQA.png',
      description: 'Ensures the project meets defined quality standards by monitoring deliverables, identifying issues, and supporting continuous improvement throughout the development process.',
      socials: { linkedin: '#', twitter: '#', github: '#' }
    }
  ];

  const selectedMember = teamMembers.find(member => member.id === selectedId);

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

        /* Prevent scrolling when modal is open */
        body.modal-open {
            overflow: hidden;
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

        /* Team Section */
        .team-section {
            padding: 160px 60px 80px;
            max-width: 1400px;
            margin: 0 auto;
            min-height: calc(100vh - 300px);
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .team-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .team-badge {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .team-header h1 {
            font-size: 48px;
            color: white;
            margin-bottom: 20px;
        }

        .team-header p {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.6);
            max-width: 600px;
            margin: 0 auto;
        }

        .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 40px;
            width: 100%;
        }

        .team-card {
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(15, 23, 42, 0.3) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 40px 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: border-color 0.3s ease;
        }

        .team-card:hover {
            border-color: rgba(96, 165, 250, 0.3);
        }

        .team-card-image {
            width: 100%;
            aspect-ratio: 3/4;
            border-radius: 16px;
            overflow: hidden;
            border: 2px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 24px;
        }

        .team-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .team-card h3 {
            font-size: 22px;
            color: white;
            margin-bottom: 8px;
            text-align: center;
            line-height: 1.3;
        }

        .team-card p.role {
            color: #60a5fa;
            font-weight: 500;
            font-size: 15px;
            text-align: center;
        }

        /* Modal Overlay */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(8px);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .modal-card {
            background: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            position: relative;
        }

        .modal-card .team-card-image {
            width: 100%;
            max-width: 250px;
            height: auto;
            aspect-ratio: 3/4;
            border-radius: 16px;
            margin-bottom: 24px;
        }

        .modal-card h3 {
            font-size: 32px;
            color: white;
            margin-bottom: 8px;
        }

        .modal-card p.role {
            color: #60a5fa;
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 24px;
        }

        .modal-card p.desc {
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            font-size: 16px;
        }

        .social-links {
            display: flex;
            gap: 16px;
            margin-top: 24px;
            justify-content: center;
        }

        .social-link {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.6);
            transition: all 0.3s ease;
            text-decoration: none;
        }

        .social-link:hover {
            background: rgba(59, 130, 246, 0.2);
            color: #60a5fa;
            transform: translateY(-2px);
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

        .team-signature {
            text-align: center;
            padding-top: 60px;
            color: rgba(255, 255, 255, 0.3);
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 2px;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            margin-top: 60px;
        }

        @media (max-width: 1200px) {
            .team-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
            }
        }

        @media (max-width: 968px) {
            .team-section {
                padding: 120px 30px 60px;
            }
            .team-header h1 {
                font-size: 36px;
            }
            .team-header p {
                font-size: 16px;
            }
            nav {
                display: none;
            }
            .footer-content {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 640px) {
            .team-grid {
                grid-template-columns: 1fr;
                gap: 24px;
                max-width: 400px;
                margin: 0 auto;
            }
            .team-section {
                padding: 100px 20px 40px;
            }
            .team-card {
                padding: 30px;
            }
            .team-card h3 {
                font-size: 20px;
            }
            .team-header h1 {
                font-size: 28px;
            }
            .team-signature {
                font-size: 14px;
                letter-spacing: 1px;
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

      <section className="team-section">
        <motion.div
          className="team-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="team-badge">OUR TEAM</div>
          <h1>Meet the Minds</h1>
          <p>
            The dedicated members behind Eat's on Tap, consistently striving to innovate meal distribution systems through robust and seamless RFID technology.
          </p>
        </motion.div>

        <div className="team-grid">
          {teamMembers.map(member => (
            <motion.div
              layoutId={`card-${member.id}`}
              key={member.id}
              className="team-card"
              onClick={() => {
                setSelectedId(member.id);
                document.body.classList.add('modal-open');
              }}
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div layoutId={`image-${member.id}`} className="team-card-image">
                <img src={member.image} alt={member.name} />
              </motion.div>
              <motion.h3 layoutId={`name-${member.id}`}>{member.name}</motion.h3>
              <motion.p layoutId={`role-${member.id}`} className="role">{member.role}</motion.p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="team-signature"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          BSIS 4 TEAM 4 2025 - 26
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedId && selectedMember && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedId(null);
              document.body.classList.remove('modal-open');
            }}
          >
            <motion.div
              layoutId={`card-${selectedId}`}
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div layoutId={`image-${selectedId}`} className="team-card-image">
                <img src={selectedMember.image} alt={selectedMember.name} />
              </motion.div>
              <motion.h3 layoutId={`name-${selectedId}`}>{selectedMember.name}</motion.h3>
              <motion.p layoutId={`role-${selectedId}`} className="role">{selectedMember.role}</motion.p>

              <motion.p
                className="desc"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {selectedMember.description}
              </motion.p>

              <motion.div
                className="social-links"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {selectedMember.socials?.linkedin && (
                  <a href={selectedMember.socials.linkedin} className="social-link" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                )}
                {selectedMember.socials?.twitter && (
                  <a href={selectedMember.socials.twitter} className="social-link" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                  </a>
                )}
                {selectedMember.socials?.github && (
                  <a href={selectedMember.socials.github} className="social-link" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                )}
                {selectedMember.socials?.spotify && (
                  <a href={selectedMember.socials.spotify} className="social-link" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.467 17.273a.75.75 0 01-.99.27c-2.707-1.662-6.114-2.039-10.12-1.136a.75.75 0 01-.3-1.468c4.344-.887 8.083-.445 11.112 1.28a.75.75 0 01.298 1.054zm1.424-3.49a.75.75 0 01-1.02.34c-3.1-1.76-7.828-2.276-11.489-1.27a.75.75 0 01-.358-1.455c4.031-.985 8.47-0.383 11.717 1.435a.75.75 0 01.15 1.0zm-.091-3.574c-3.627-2.07-9.72-2.257-13.448-1.26a.75.75 0 01-.41-1.438c3.964-1.13 10.692-.913 14.682 1.38a.75.75 0 01-.825 1.318z" /></svg>
                  </a>
                )}
                {selectedMember.socials?.instagram && (
                  <a href={selectedMember.socials.instagram} className="social-link" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403a4.9 4.9 0 011.675 1.093 4.9 4.9 0 011.093 1.675c.163.457.347 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.902 4.902 0 01-1.093 1.675 4.902 4.902 0 01-1.675 1.093c-.457.163-1.257.347-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.9 4.9 0 01-1.675-1.093 4.9 4.9 0 01-1.093-1.675c-.163-.457-.347-1.257-.403-2.427C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427a4.9 4.9 0 011.093-1.675A4.9 4.9 0 015.334 2.566c.457-.163 1.257-.347 2.427-.403C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.736 0 8.332.012 7.052.07 5.777.128 4.653.34 3.72.724c-.94.382-1.737.897-2.537 1.697C.343 3.221-.172 4.018-.554 4.958c-.384.933-.596 2.057-.654 3.332C-.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.275.27 2.399.654 3.332.382.94.897 1.737 1.697 2.537.8.8 1.597 1.315 2.537 1.697.933.384 2.057.596 3.332.654C8.332 23.988 8.736 24 12 24c3.264 0 3.668-.012 4.948-.07 1.275-.058 2.399-.27 3.332-.654.94-.382 1.737-.897 2.537-1.697.8-.8 1.315-1.597 1.697-2.537.384-.933.596-2.057.654-3.332.058-1.28.07-1.684.07-4.948 0-3.264-.012-3.668-.07-4.948-.058-1.275-.27-2.399-.654-3.332-.382-.94-.897-1.737-1.697-2.537C20.428.343 19.631-.172 18.69-.554c-.933-.384-2.057-.596-3.332-.654C15.668.012 15.264 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
                  </a>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default TeamPage;
