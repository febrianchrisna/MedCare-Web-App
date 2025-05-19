import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Medicine = db.define("medicine", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expiry_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, 
{ freezeTableName: true }
);

export default Medicine;
