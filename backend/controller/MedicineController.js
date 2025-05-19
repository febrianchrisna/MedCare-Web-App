import Medicine from '../models/MedicineModel.js';
import { Op } from 'sequelize';

// Get all medicines
export const getMedicines = async (req, res) => {
    try {
        const { category, search, featured, limit } = req.query;
        let whereClause = {};
        
        // Filter by category if provided
        if (category) {
            whereClause.category = category;
        }
        
        // Filter by featured flag
        if (featured === 'true') {
            whereClause.featured = true;
        }
        
        // Search by medicine name
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }
        
        const options = {
            where: whereClause,
            order: [['createdAt', 'DESC']]
        };
        
        // Add limit if provided
        if (limit) {
            options.limit = parseInt(limit);
        }
        
        const medicines = await Medicine.findAll(options);
        
        res.status(200).json(medicines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single medicine by ID
export const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findByPk(req.params.id);
        
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        
        res.status(200).json(medicine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new medicine (admin only)
export const createMedicine = async (req, res) => {
    try {
        const { name, description, price, image, category, stock, manufacturer, dosage, expiry_date, featured } = req.body;
        
        const newMedicine = await Medicine.create({
            name,
            description,
            price,
            image,
            category,
            stock: stock || 0,
            manufacturer,
            dosage,
            expiry_date: expiry_date ? new Date(expiry_date) : null,
            featured: featured || false
        });
        
        res.status(201).json(newMedicine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update medicine (admin only)
export const updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByPk(req.params.id);
        
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        
        // Handle expiry_date conversion if it exists
        if (req.body.expiry_date) {
            req.body.expiry_date = new Date(req.body.expiry_date);
        }
        
        await medicine.update(req.body);
        
        res.status(200).json({
            message: 'Medicine updated successfully',
            medicine
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete medicine (admin only)
export const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByPk(req.params.id);
        
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        
        await medicine.destroy();
        
        res.status(200).json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get medicine categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Medicine.findAll({
            attributes: ['category'],
            group: ['category']
        });
        
        res.status(200).json(categories.map(item => item.category));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
