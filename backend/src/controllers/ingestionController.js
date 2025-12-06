const ShopifyService = require('../services/shopifyService');
const { Product, Customer, Order } = require('../models');

const ingestData = async (req, res) => {
    const { tenant } = req;

    if (!tenant.access_token) {
        return res.status(400).json({ error: 'Tenant does not have Shopify access token configured' });
    }

    const shopifyService = new ShopifyService(tenant.shopify_domain, tenant.access_token);

    try {
        // 1. Ingest Products
        const products = await shopifyService.getProducts();
        for (const prod of products) {
            await Product.upsert({
                id: String(prod.id),
                tenant_id: tenant.id,
                title: prod.title,
                price: prod.variants[0]?.price || 0.00,
            });
        }

        // 2. Ingest Customers
        const customers = await shopifyService.getCustomers();
        for (const cust of customers) {
            await Customer.upsert({
                id: String(cust.id),
                tenant_id: tenant.id,
                first_name: cust.first_name,
                last_name: cust.last_name,
                email: cust.email,
                total_spent: cust.total_spent,
                orders_count: cust.orders_count,
            });
        }

        // 3. Ingest Orders
        const orders = await shopifyService.getOrders();
        for (const ord of orders) {
            await Order.upsert({
                id: String(ord.id),
                tenant_id: tenant.id,
                customer_id: ord.customer ? String(ord.customer.id) : null,
                total_price: ord.total_price,
                financial_status: ord.financial_status,
                created_at_shopify: ord.created_at,
            });
        }

        res.status(200).json({
            message: 'Data ingestion completed successfully', stats: {
                products: products.length,
                customers: customers.length,
                orders: orders.length
            }
        });

    } catch (error) {
        console.error('Ingestion error:', error);
        res.status(500).json({ error: 'Data ingestion failed' });
    }
};

module.exports = { ingestData };
