import User from './UserModel.js';
import Medicine from './MedicineModel.js';
import Order from './OrderModel.js';
import OrderDetail from './OrderDetailModel.js';

// User and Order associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Order and OrderDetail associations
Order.hasMany(OrderDetail, { foreignKey: 'orderId' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderId' });

// Medicine and OrderDetail associations
Medicine.hasMany(OrderDetail, { foreignKey: 'medicineId' });
OrderDetail.belongsTo(Medicine, { foreignKey: 'medicineId' });

export { User, Medicine, Order, OrderDetail };
