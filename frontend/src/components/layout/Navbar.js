import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Badge, Dropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaClipboardList, FaSearch } from 'react-icons/fa';
import { RiMedicineBottleFill } from 'react-icons/ri';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login');
    }
  };

  return (
    <BootstrapNavbar 
      bg={scrolled ? "white" : "transparent"} 
      expand="lg" 
      className={`fixed-top transition-all ${scrolled ? 'shadow-sm' : ''}`}
      style={{ transition: 'all 0.3s ease' }}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <div className="d-flex align-items-center">
            <RiMedicineBottleFill size="1.8em" className="text-primary me-2" />
            <span className="pharmacy-brand">MedCare</span>
          </div>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="navbarNav" />
        
        <BootstrapNavbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/medicines"
              className={location.pathname.includes('/medicines') ? 'active' : ''}
            >
              Medicines
            </Nav.Link>
            
            {isAdmin() && (
              <Nav.Link 
                as={Link} 
                to="/admin"
                className={location.pathname.includes('/admin') ? 'active' : ''}
              >
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated() ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/cart" 
                  className={`position-relative me-3 ${location.pathname === '/cart' ? 'active' : ''}`}
                >
                  <FaShoppingCart size="1.2em" />
                  {totalItems > 0 && (
                    <Badge 
                      bg="danger" 
                      pill 
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/orders" 
                  className={`me-3 ${location.pathname.includes('/orders') ? 'active' : ''}`}
                >
                  <FaClipboardList size="1.2em" />
                </Nav.Link>
                
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="outline-primary" 
                    id="user-dropdown" 
                    className="border-0"
                  >
                    <FaUserCircle className="me-1" />
                    <span>{user?.username}</span>
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu className="shadow border-0">
                    <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/orders">My Orders</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary"
                  className="me-2"
                >
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
