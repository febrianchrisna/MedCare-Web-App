import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMedkit, FaShippingFast, FaHeadset, FaCheck, FaMicroscope, FaTablets, FaClinicMedical } from 'react-icons/fa';
import { RiMedicineBottleFill, RiHealthBookFill } from 'react-icons/ri';
import api from '../services/api';
import { CartContext } from '../contexts/CartContext';
import { MEDICINE_DEFAULT_IMG } from '../config/constants';
import MedicineCard from '../components/common/MedicineCard';
import MedicineAnimation from '../components/animations/MedicineAnimation';

const Home = () => {
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  
  // Simulated special promotions
  const promotions = [
    {
      id: 1,
      title: "Summer Health Sale",
      description: "Up to 30% off on selected health supplements",
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGhhcm1hY3l8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 2,
      title: "New Vitamins Collection",
      description: "Explore our new range of immunity-boosting vitamins",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGhhcm1hY3l8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 3,
      title: "Free Health Consultation",
      description: "Book a free consultation with our healthcare professionals",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBoYXJtYWN5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
    }
  ];

  useEffect(() => {
    const fetchFeaturedMedicines = async () => {
      try {
        // This API call uses the featured flag filter
        const response = await api.get('/medicines?featured=true&limit=4');
        setFeaturedMedicines(response.data);
      } catch (error) {
        console.error('Error fetching featured medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMedicines();
  }, []);

  return (
    <div>
      {/* Hero Section - Updated to use the 3D animation */}
      <section className="hero-section d-flex align-items-center bg-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">Your Health Is Our Priority</h1>
              <p className="lead mb-4">
                Get your medicines delivered to your doorstep. Fast, reliable, and secure service with a wide range of healthcare products.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button as={Link} to="/medicines" variant="primary" size="lg" className="px-4 py-2">
                  Shop Now
                </Button>
              </div>
            </Col>
            <Col lg={5} className="text-center">
              {/* 3D Medicine Animation instead of image */}
              <div className="d-flex justify-content-center justify-content-lg-end">
                <MedicineAnimation />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Promotions Section */}
      <section className="py-5 bg-white">
        <Container>
          <Carousel 
            className="home-carousel mb-5"
            indicators={true}
            controls={true}
          >
            {promotions.map(promo => (
              <Carousel.Item key={promo.id}>
                <div className="carousel-content position-relative">
                  <img
                    className="d-block w-100 rounded-3"
                    src={promo.image}
                    alt={promo.title}
                    style={{ height: '350px', objectFit: 'cover', filter: 'brightness(0.85)' }}
                  />
                  <Carousel.Caption className="text-start pb-5">
                    <h3 className="mb-2">{promo.title}</h3>
                    <p>{promo.description}</p>
                    <Button variant="light" className="mt-2">Learn More</Button>
                  </Carousel.Caption>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light pharmacy-pattern">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Why Choose Us</h2>
          <Row className="g-4">
            <Col md={3} className="text-center mb-4 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <div className="feature-icon bg-primary text-white rounded-circle p-3 mb-4" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RiMedicineBottleFill size="2.5em" />
                </div>
                <h4 className="mb-3">Quality Products</h4>
                <p className="text-muted">All our medicines are sourced directly from authorized manufacturers and distributors</p>
              </div>
            </Col>
            <Col md={3} className="text-center mb-4 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <div className="feature-icon bg-primary text-white rounded-circle p-3 mb-4" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaShippingFast size="2.5em" />
                </div>
                <h4 className="mb-3">Fast Delivery</h4>
                <p className="text-muted">Get your medicines delivered within 24 hours with our express delivery service</p>
              </div>
            </Col>
            <Col md={3} className="text-center mb-4 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <div className="feature-icon bg-primary text-white rounded-circle p-3 mb-4" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaHeadset size="2.5em" />
                </div>
                <h4 className="mb-3">24/7 Support</h4>
                <p className="text-muted">Our customer support team and pharmacists are always available to help you</p>
              </div>
            </Col>
            <Col md={3} className="text-center mb-4 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <div className="feature-icon bg-primary text-white rounded-circle p-3 mb-4" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RiHealthBookFill size="2.5em" />
                </div>
                <h4 className="mb-3">Health Advice</h4>
                <p className="text-muted">Get professional healthcare advice from our team of experienced pharmacists</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Shop By Category</h2>
          <Row className="g-4">
            <Col md={4} className="mb-4">
              <Link to="/medicines?category=Pain Relief" className="text-decoration-none">
                <Card className="category-card text-center h-100 border-0">
                  <div className="category-icon bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                    <FaTablets size="2.5em" className="text-primary" />
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">Pain Relief</Card.Title>
                    <Card.Text className="text-muted">Painkillers, anti-inflammatory medicines, and muscle relaxants</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col md={4} className="mb-4">
              <Link to="/medicines?category=Antibiotics" className="text-decoration-none">
                <Card className="category-card text-center h-100 border-0">
                  <div className="category-icon bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                    <FaMicroscope size="2.5em" className="text-primary" />
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">Antibiotics</Card.Title>
                    <Card.Text className="text-muted">Prescription antibiotics for bacterial infections</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col md={4} className="mb-4">
              <Link to="/medicines?category=First Aid" className="text-decoration-none">
                <Card className="category-card text-center h-100 border-0">
                  <div className="category-icon bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                    <FaClinicMedical size="2.5em" className="text-primary" />
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">First Aid</Card.Title>
                    <Card.Text className="text-muted">Essential first aid supplies for home and emergency use</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Medicines Section */}
      <section className="featured-section pharmacy-pattern py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Featured Medicines</h2>
            <p className="text-muted w-75 mx-auto">Discover our most popular products chosen for their quality and effectiveness</p>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Row className="g-4">
              {featuredMedicines.map(medicine => (
                <Col key={medicine.id} md={6} lg={3} className="mb-4">
                  <MedicineCard medicine={medicine} />
                </Col>
              ))}
            </Row>
          )}
          
          <div className="text-center mt-5">
            <Button as={Link} to="/medicines" variant="outline-primary" size="lg" className="px-4">
              View All Medicines
            </Button>
          </div>
        </Container>
      </section>

      {/* Health Tips Section */}
      <section className="py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Health Tips</h2>
            <p className="text-muted">Expert advice to help you stay healthy</p>
          </div>

          <Row className="g-4">
            <Col md={4} className="mb-4">
              <Card className="health-tip-card h-100 border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="tip-icon bg-primary bg-opacity-10 rounded p-2 me-3">
                      <FaMedkit className="text-primary" />
                    </div>
                    <h5 className="mb-0">Medicine Storage</h5>
                  </div>
                  <Card.Text>
                    Store your medicines in a cool, dry place away from direct sunlight. Always check expiry dates before use.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="health-tip-card h-100 border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="tip-icon bg-primary bg-opacity-10 rounded p-2 me-3">
                      <FaCheck className="text-primary" />
                    </div>
                    <h5 className="mb-0">Following Prescription</h5>
                  </div>
                  <Card.Text>
                    Always complete your full course of antibiotics as prescribed, even if you start feeling better before they're finished.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="health-tip-card h-100 border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="tip-icon bg-primary bg-opacity-10 rounded p-2 me-3">
                      <FaHeadset className="text-primary" />
                    </div>
                    <h5 className="mb-0">Ask Your Pharmacist</h5>
                  </div>
                  <Card.Text>
                    Don't hesitate to consult our pharmacists if you have questions about your medication or how to take it properly.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
