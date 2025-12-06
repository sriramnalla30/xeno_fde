const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.STRING, // Shopify ID
        primaryKey: true,
        allowNull: false,
    },
    tenant_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
    },
    last_name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    total_spent: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    orders_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

module.exports = Customer;
