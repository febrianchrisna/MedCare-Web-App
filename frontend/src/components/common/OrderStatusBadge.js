import React from 'react';
import { Badge } from 'react-bootstrap';
import { STATUS_COLORS } from '../../config/constants';

const OrderStatusBadge = ({ status }) => {
  return (
    <Badge 
      bg={STATUS_COLORS[status]} 
      className={`status-badge-${status}`}
    >
      {status.toUpperCase()}
    </Badge>
  );
};

export default OrderStatusBadge;
