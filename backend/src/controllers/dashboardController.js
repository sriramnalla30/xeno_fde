const { Product, Customer, Order, sequelize } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
    const { tenant } = req;

    try {
        const totalCustomers = await Customer.count({ where: { tenant_id: tenant.id } });
        const totalOrders = await Order.count({ where: { tenant_id: tenant.id } });
        const totalRevenue = await Order.sum('total_price', { where: { tenant_id: tenant.id } });
        const totalProducts = await Product.count({ where: { tenant_id: tenant.id } });
        const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

        res.json({
            totalCustomers,
            totalOrders,
            totalRevenue: totalRevenue || 0,
            totalProducts,
            avgOrderValue: parseFloat(avgOrderValue),
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

const getRecentOrders = async (req, res) => {
    const { tenant } = req;
    const { startDate, endDate, limit = 10 } = req.query;

    try {
        const whereClause = { tenant_id: tenant.id };

        if (startDate && endDate) {
            whereClause.created_at_shopify = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        const orders = await Order.findAll({
            where: whereClause,
            limit: parseInt(limit),
            order: [['created_at_shopify', 'DESC']],
            include: ['Customer']
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

const getTopCustomers = async (req, res) => {
    const { tenant } = req;
    const { limit = 5 } = req.query;

    try {
        const customers = await Customer.findAll({
            where: { tenant_id: tenant.id },
            limit: parseInt(limit),
            order: [['total_spent', 'DESC']],
        });
        res.json(customers);
    } catch (error) {
        console.error('Error fetching top customers:', error);
        res.status(500).json({ error: 'Failed to fetch top customers' });
    }
};

const getOrdersByDate = async (req, res) => {
    const { tenant } = req;
    const { days = 30 } = req.query;

    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const orders = await Order.findAll({
            where: {
                tenant_id: tenant.id,
                created_at_shopify: {
                    [Op.gte]: startDate,
                },
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at_shopify')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue'],
            ],
            group: [sequelize.fn('DATE', sequelize.col('created_at_shopify'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at_shopify')), 'ASC']],
            raw: true,
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders by date:', error);
        res.status(500).json({ error: 'Failed to fetch orders by date' });
    }
};

const getOrdersByTime = async (req, res) => {
    const { tenant } = req;
    const { days = 7 } = req.query;

    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const orders = await Order.findAll({
            where: {
                tenant_id: tenant.id,
                created_at_shopify: {
                    [Op.gte]: startDate,
                },
            },
            attributes: [
                [sequelize.fn('HOUR', sequelize.col('created_at_shopify')), 'hour'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue'],
            ],
            group: [sequelize.fn('HOUR', sequelize.col('created_at_shopify'))],
            order: [[sequelize.fn('HOUR', sequelize.col('created_at_shopify')), 'ASC']],
            raw: true,
        });

        // Format hours for display (e.g., "9 AM", "10 AM")
        const formattedOrders = orders.map(order => ({
            ...order,
            time: order.hour < 12
                ? `${order.hour === 0 ? 12 : order.hour} AM`
                : `${order.hour === 12 ? 12 : order.hour - 12} PM`
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders by time:', error);
        res.status(500).json({ error: 'Failed to fetch orders by time' });
    }
};

const getProducts = async (req, res) => {
    const { tenant } = req;

    try {
        const products = await Product.findAll({
            where: { tenant_id: tenant.id },
            order: [['createdAt', 'DESC']],
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

module.exports = { getDashboardStats, getRecentOrders, getTopCustomers, getOrdersByDate, getOrdersByTime, getProducts };

