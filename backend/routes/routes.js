import express from 'express';
import { login, register, logout, getUser } from '../controller/UserController.js';
import { 
    getMedicines, getMedicineById, createMedicine, 
    updateMedicine, deleteMedicine, getCategories 
} from '../controller/MedicineController.js';
import { 
    getAllOrders, getUserOrders, getOrderById, 
    createOrder, updateOrderStatus, cancelUserOrder, deleteUserOrder, updateUserOrder
} from '../controller/OrderController.js';
import { verifyToken, isAdmin } from '../middleware/AuthMiddleware.js';
import { refreshToken } from '../controller/RefreshToken.js';

const router = express.Router();

// ==================== AUTH ROUTES (untuk semua) ====================
router.post("/login", login);
router.post("/register", register);
router.get("/logout", verifyToken, logout);
router.get("/token", refreshToken);

// ==================== ADMIN ROUTES (khusus admin) ====================
// User management (admin only)
router.get("/users", verifyToken, isAdmin, getUser);

// Medicine management (admin only)
router.get("/medicines", getMedicines);
router.post("/medicines", verifyToken, isAdmin, createMedicine);
router.put("/medicines/:id", verifyToken, isAdmin, updateMedicine);
router.delete("/medicines/:id", verifyToken, isAdmin, deleteMedicine);

// Order management (admin only)
router.get("/orders", verifyToken, isAdmin, getAllOrders);
router.put("/orders/:id/status", verifyToken, isAdmin, updateOrderStatus);
router.delete("/orders/:id", verifyToken, isAdmin, deleteUserOrder); // Admin hapus pesanan

// ==================== USER ROUTES (khusus user) ====================
// Medicine browsing (user & public)
router.get("/medicines/categories", getCategories);
router.get("/medicines/:id", getMedicineById);

// Order management (user only)
router.get("/user/orders", verifyToken, getUserOrders);
router.get("/orders/:id", verifyToken, getOrderById);
router.post("/orders", verifyToken, createOrder);
router.put("/user/orders/:id/cancel", verifyToken, cancelUserOrder);
router.put("/user/orders/:id", verifyToken, updateUserOrder); // User edit pesanan
router.delete("/user/orders/:id", verifyToken, deleteUserOrder); // Hapus pesanan dari database

// ==================== HEALTH CHECK ====================
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

export default router;
