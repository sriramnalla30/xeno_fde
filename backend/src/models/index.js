const { sequelize } = require('../config/database');
const Tenant = require('./Tenant');
const Product = require('./Product');
const Customer = require('./Customer');
const Order = require('./Order');
const User = require('./User');

// Associations
Tenant.hasMany(Product, { foreignKey: 'tenant_id' });
Product.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Customer, { foreignKey: 'tenant_id' });
Customer.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Order, { foreignKey: 'tenant_id' });
Order.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Customer.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });

Tenant.hasMany(User, { foreignKey: 'tenant_id' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id' });

module.exports = {
    sequelize,
    Tenant,
    Product,
    Customer,
    Order,
    User,
};
