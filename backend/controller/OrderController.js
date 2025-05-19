import Order from '../models/OrderModel.js';
import OrderDetail from '../models/OrderDetailModel.js';
import Medicine from '../models/MedicineModel.js';
import db from '../config/database.js';

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderDetail,
                    include: [Medicine]
                },
                {
                    association: 'user',
                    attributes: ['id', 'username', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        
        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderDetail,
                    include: [Medicine]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: OrderDetail,
                    include: [Medicine]
                },
                {
                    association: 'user',
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        const userRole = req.userRole || (req.user && req.user.role);
        if (userRole === 'admin' || req.userId === order.userId) {
            return res.status(200).json(order);
        } else {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new order
export const createOrder = async (req, res) => {
    const transaction = await db.transaction();
    
    try {
        const { items, shipping_address, payment_method, notes } = req.body;
        const userId = req.userId;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }
        
        // Calculate total amount and check stock
        let total_amount = 0;
        const medicineUpdates = [];
        const insufficientStockMedicines = [];
        
        for (const item of items) {
            const medicine = await Medicine.findByPk(item.medicineId, { transaction });
            
            if (!medicine) {
                await transaction.rollback();
                return res.status(404).json({ message: `Medicine with ID ${item.medicineId} not found` });
            }
            
            // Check stock availability
            if (medicine.stock < item.quantity) {
                insufficientStockMedicines.push({
                    id: medicine.id,
                    name: medicine.name,
                    available: medicine.stock,
                    requested: item.quantity
                });
            } else {
                total_amount += medicine.price * item.quantity;
                medicineUpdates.push({
                    medicine,
                    quantityToReduce: item.quantity
                });
            }
        }
        
        // If any medicines have insufficient stock, abort the order
        if (insufficientStockMedicines.length > 0) {
            await transaction.rollback();
            return res.status(400).json({ 
                message: 'Some medicines have insufficient stock',
                insufficientStockMedicines 
            });
        }
        
        // Create order
        const newOrder = await Order.create({
            userId,
            total_amount,
            status: 'pending',
            shipping_address,
            payment_method,
            notes: notes || null
        }, { transaction });
        
        // Create order details and update medicine stock
        const orderDetails = [];
        
        for (const update of medicineUpdates) {
            const { medicine, quantityToReduce } = update;
            const subtotal = medicine.price * quantityToReduce;
            
            // Update medicine stock
            await medicine.update({ 
                stock: medicine.stock - quantityToReduce 
            }, { transaction });
            
            const orderDetail = await OrderDetail.create({
                orderId: newOrder.id,
                medicineId: medicine.id,
                quantity: quantityToReduce,
                price: medicine.price,
                subtotal
            }, { transaction });
            
            orderDetails.push({
                ...orderDetail.toJSON(),
                medicine: {
                    id: medicine.id,
                    name: medicine.name,
                    price: medicine.price,
                    image: medicine.image
                }
            });
        }
        
        await transaction.commit();
        
        res.status(201).json({
            message: 'Order created successfully',
            order: {
                id: newOrder.id,
                userId,
                total_amount,
                status: 'pending',
                shipping_address,
                payment_method,
                notes,
                createdAt: newOrder.createdAt,
                order_details: orderDetails
            }
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        await order.update({ status });
        
        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cancel order by user (only their own pending orders)
export const cancelUserOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const orderId = req.params.id;
        
        const order = await Order.findByPk(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Verify the order belongs to the logged-in user
        if (order.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to modify this order' });
        }
        
        // Check if the order is in a status that can be cancelled
        if (order.status !== 'pending') {
            return res.status(400).json({ 
                message: 'Only pending orders can be cancelled' 
            });
        }
        
        // Handle stock restoration for cancelled orders
        const orderDetails = await OrderDetail.findAll({
            where: { orderId: order.id },
            include: [Medicine]
        });
        
        const transaction = await db.transaction();
        
        try {
            // Return items to inventory
            for (const detail of orderDetails) {
                await Medicine.increment(
                    { stock: detail.quantity }, 
                    { 
                        where: { id: detail.medicineId },
                        transaction 
                    }
                );
            }
            
            // Update order status to cancelled
            await order.update({ status: 'cancelled' }, { transaction });
            
            await transaction.commit();
            
            res.status(200).json({
                message: 'Order cancelled successfully',
                order
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update order details by user (only their own pending orders)
export const updateUserOrder = async (req, res) => {
    try {
        const { shipping_address, payment_method, notes } = req.body;
        const userId = req.userId;
        const orderId = req.params.id;
        
        const order = await Order.findByPk(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Verify the order belongs to the logged-in user
        if (order.userId !== userId && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to modify this order' });
        }
        
        // Check if the order is in a status that can be edited
        if (order.status !== 'pending' && req.userRole !== 'admin') {
            return res.status(400).json({ 
                message: 'Only pending orders can be edited' 
            });
        }
        
        // For admin users, they can update status as well
        if (req.userRole === 'admin' && req.body.status) {
            await order.update({ 
                shipping_address, 
                payment_method,
                notes,
                status: req.body.status
            });
        } else {
            // Regular users can only update shipping and payment
            await order.update({ shipping_address, payment_method, notes });
        }
        
        res.status(200).json({
            message: 'Order updated successfully',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete order (permanent delete) - for user's own orders and admin
export const deleteUserOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const orderId = req.params.id;

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Allow admin to delete any order, user only their own
        const userRole = req.userRole || (req.user && req.user.role);
        if (userRole !== 'admin' && order.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this order' });
        }

        // Only allow deletion of pending orders for regular users
        if (order.status !== 'pending' && userRole !== 'admin') {
            return res.status(400).json({ 
                message: 'Only pending orders can be deleted. Please cancel the order first.' 
            });
        }

        // Handle stock restoration
        const orderDetails = await OrderDetail.findAll({
            where: { orderId: order.id }
        });

        const transaction = await db.transaction();

        try {
            // Return items to inventory
            for (const detail of orderDetails) {
                await Medicine.increment(
                    { stock: detail.quantity }, 
                    { 
                        where: { id: detail.medicineId },
                        transaction 
                    }
                );
            }

            // Delete order details
            await OrderDetail.destroy({
                where: { orderId: order.id },
                transaction
            });

            // Delete the order (permanent delete)
            await order.destroy({ transaction });

            await transaction.commit();

            res.status(200).json({
                message: 'Order deleted successfully'
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
