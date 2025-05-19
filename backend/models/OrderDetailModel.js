import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Order from "./OrderModel.js";
import Medicine from "./MedicineModel.js";

const { DataTypes } = Sequelize;

const OrderDetail = db.define("order_detail", {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        }
    },
    medicineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Medicine,
            key: 'id'
        }
    }
}, 
{ freezeTableName: true }
);

export default OrderDetail;
