const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.STRING, // Shopify ID
        primaryKey: true,
        allowNull: false,
    },
    tenant_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customer_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    financial_status: {
        type: DataTypes.STRING,
    },
    created_at_shopify: {
        type: DataTypes.DATE,
    }
});

module.exports = Order;
