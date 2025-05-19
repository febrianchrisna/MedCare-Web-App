import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { RiMedicineBottleFill } from 'react-icons/ri';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-4">
              <RiMedicineBottleFill size="2em" className="text-primary me-2" />
              <h4 className="pharmacy-brand m-0">MedCare</h4>
            </div>
            <p className="text-muted">Your trusted pharmacy for all your healthcare needs. We provide high-quality medicines and healthcare products with reliable service and prompt delivery.</p>
            <div className="d-flex mt-4">
              <a href="#!" className="me-3 btn btn-outline-light btn-sm rounded-circle">
                <FaFacebook />
              </a>
              <a href="#!" className="me-3 btn btn-outline-light btn-sm rounded-circle">
                <FaTwitter />
              </a>
              <a href="#!" className="me-3 btn btn-outline-light btn-sm rounded-circle">
                <FaInstagram />
              </a>
              <a href="#!" className="btn btn-outline-light btn-sm rounded-circle">
                <FaWhatsapp />
              </a>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-md-0">
            <h5 className="text-white mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <Link to="/" className="text-decoration-none text-muted hover-effect">
                  Home
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/medicines" className="text-decoration-none text-muted hover-effect">
                  Medicines
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/cart" className="text-decoration-none text-muted hover-effect">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-decoration-none text-muted hover-effect">
                  My Orders
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-white mb-4">Help & Support</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="#!" className="text-decoration-none text-muted hover-effect">
                  FAQs
                </a>
              </li>
              <li className="mb-3">
                <a href="#!" className="text-decoration-none text-muted hover-effect">
                  Shipping Policy
                </a>
              </li>
              <li className="mb-3">
                <a href="#!" className="text-decoration-none text-muted hover-effect">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#!" className="text-decoration-none text-muted hover-effect">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6}>
            <h5 className="text-white mb-4">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="me-3 text-primary" /> 
                <span className="text-muted">123 Pharmacy Street, City Center, Country</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhoneAlt className="me-3 text-primary" /> 
                <span className="text-muted">(123) 456-7890</span>
              </li>
              <li className="d-flex align-items-center">
                <FaEnvelope className="me-3 text-primary" /> 
                <span className="text-muted">info@medcare.com</span>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="mt-4 bg-secondary opacity-25" />
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="text-muted mb-md-0">
            &copy; {year} MedCare. All rights reserved.
          </p>
          <div>
            <a href="#!" className="text-decoration-none text-muted me-3 small">Terms of Service</a>
            <a href="#!" className="text-decoration-none text-muted me-3 small">Privacy Policy</a>
            <a href="#!" className="text-decoration-none text-muted small">Cookie Policy</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
