const { sequelize, Tenant, Product, Customer, Order } = require('./src/models');
require('dotenv').config();

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');
        await sequelize.sync({ alter: true });

        // 1. Create/Update Tenant
        const [tenant] = await Tenant.upsert({
            id: 'demo-store',
            store_name: 'Demo Shopify Store',
            shopify_domain: 'demo-store.myshopify.com',
            access_token: 'demo_token',
        });
        console.log('✅ Tenant created: demo-store');

        // 2. Seed Products
        const products = [
            { id: 'prod-1', tenant_id: 'demo-store', title: 'Wireless Bluetooth Headphones', price: 79.99 },
            { id: 'prod-2', tenant_id: 'demo-store', title: 'Smart Watch Pro', price: 199.99 },
            { id: 'prod-3', tenant_id: 'demo-store', title: 'Portable Charger 20000mAh', price: 49.99 },
            { id: 'prod-4', tenant_id: 'demo-store', title: 'USB-C Hub 7-in-1', price: 34.99 },
            { id: 'prod-5', tenant_id: 'demo-store', title: 'Mechanical Keyboard RGB', price: 129.99 },
            { id: 'prod-6', tenant_id: 'demo-store', title: 'Ergonomic Mouse', price: 59.99 },
            { id: 'prod-7', tenant_id: 'demo-store', title: '4K Webcam', price: 89.99 },
            { id: 'prod-8', tenant_id: 'demo-store', title: 'Noise Cancelling Earbuds', price: 149.99 },
        ];
        for (const p of products) await Product.upsert(p);
        console.log(`✅ ${products.length} Products seeded`);

        // 3. Seed Customers
        const customers = [
            { id: 'cust-1', tenant_id: 'demo-store', first_name: 'John', last_name: 'Doe', email: 'john@example.com', total_spent: 459.97, orders_count: 3 },
            { id: 'cust-2', tenant_id: 'demo-store', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', total_spent: 329.98, orders_count: 2 },
            { id: 'cust-3', tenant_id: 'demo-store', first_name: 'Robert', last_name: 'Johnson', email: 'robert@example.com', total_spent: 749.95, orders_count: 5 },
            { id: 'cust-4', tenant_id: 'demo-store', first_name: 'Emily', last_name: 'Davis', email: 'emily@example.com', total_spent: 199.99, orders_count: 1 },
            { id: 'cust-5', tenant_id: 'demo-store', first_name: 'Michael', last_name: 'Brown', email: 'michael@example.com', total_spent: 564.96, orders_count: 4 },
            { id: 'cust-6', tenant_id: 'demo-store', first_name: 'Sarah', last_name: 'Wilson', email: 'sarah@example.com', total_spent: 289.98, orders_count: 2 },
            { id: 'cust-7', tenant_id: 'demo-store', first_name: 'David', last_name: 'Lee', email: 'david@example.com', total_spent: 879.93, orders_count: 6 },
            { id: 'cust-8', tenant_id: 'demo-store', first_name: 'Lisa', last_name: 'Taylor', email: 'lisa@example.com', total_spent: 149.99, orders_count: 1 },
        ];
        for (const c of customers) await Customer.upsert(c);
        console.log(`✅ ${customers.length} Customers seeded`);

        // 4. Seed Orders (last 30 days)
        const orders = [];
        const statuses = ['paid', 'pending', 'refunded'];
        const customerIds = customers.map(c => c.id);

        for (let i = 1; i <= 25; i++) {
            const daysAgo = Math.floor(Math.random() * 30);
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - daysAgo);

            orders.push({
                id: `order-${i}`,
                tenant_id: 'demo-store',
                customer_id: customerIds[Math.floor(Math.random() * customerIds.length)],
                total_price: (Math.random() * 300 + 30).toFixed(2),
                financial_status: statuses[Math.floor(Math.random() * statuses.length)],
                created_at_shopify: orderDate,
            });
        }
        for (const o of orders) await Order.upsert(o);
        console.log(`✅ ${orders.length} Orders seeded`);

        console.log('\n🎉 Database seeding completed!');
        console.log('Total Stats:');
        console.log(`   Products: ${await Product.count({ where: { tenant_id: 'demo-store' } })}`);
        console.log(`   Customers: ${await Customer.count({ where: { tenant_id: 'demo-store' } })}`);
        console.log(`   Orders: ${await Order.count({ where: { tenant_id: 'demo-store' } })}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await sequelize.close();
    }
};

seedData();
