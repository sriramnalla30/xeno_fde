const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tenant = sequelize.define('Tenant', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    store_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shopify_domain: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    access_token: {
        type: DataTypes.STRING,
        allowNull: true, // Can be null initially
    },
});

module.exports = Tenant;
