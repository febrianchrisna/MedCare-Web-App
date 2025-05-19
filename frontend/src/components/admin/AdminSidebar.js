import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaPills, FaClipboardList, FaUsers, FaHome } from 'react-icons/fa';

const AdminSidebar = ({ active }) => {
  return (
    <div className="p-3">
      <h5 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-3 text-muted">
        <span>Admin Panel</span>
      </h5>
      
      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/admin" 
          className={active === 'dashboard' ? 'active' : ''}
        >
          <FaTachometerAlt className="me-2" />
          Dashboard
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/admin/medicines" 
          className={active === 'medicines' ? 'active' : ''}
        >
          <FaPills className="me-2" />
          Medicines
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/admin/orders" 
          className={active === 'orders' ? 'active' : ''}
        >
          <FaClipboardList className="me-2" />
          Orders
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/admin/users" 
          className={active === 'users' ? 'active' : ''}
        >
          <FaUsers className="me-2" />
          Users
        </Nav.Link>
        
        <div className="border-top my-3"></div>
        
        <Nav.Link as={Link} to="/">
          <FaHome className="me-2" />
          Back to Store
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
