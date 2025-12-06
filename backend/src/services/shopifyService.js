const axios = require('axios');

class ShopifyService {
    constructor(shopDomain, accessToken) {
        this.shopDomain = shopDomain;
        this.accessToken = accessToken;
        this.baseUrl = `https://${shopDomain}/admin/api/2024-01`;
    }

    async getProducts() {
        try {
            const response = await axios.get(`${this.baseUrl}/products.json`, {
                headers: {
                    'X-Shopify-Access-Token': this.accessToken,
                },
            });
            return response.data.products;
        } catch (error) {
            console.error('Error fetching products from Shopify:', error.response?.data || error.message);
            throw new Error('Failed to fetch products');
        }
    }

    async getCustomers() {
        try {
            const response = await axios.get(`${this.baseUrl}/customers.json`, {
                headers: {
                    'X-Shopify-Access-Token': this.accessToken,
                },
            });
            return response.data.customers;
        } catch (error) {
            console.error('Error fetching customers from Shopify:', error.response?.data || error.message);
            throw new Error('Failed to fetch customers');
        }
    }

    async getOrders() {
        try {
            const response = await axios.get(`${this.baseUrl}/orders.json?status=any`, {
                headers: {
                    'X-Shopify-Access-Token': this.accessToken,
                },
            });
            return response.data.orders;
        } catch (error) {
            console.error('Error fetching orders from Shopify:', error.response?.data || error.message);
            throw new Error('Failed to fetch orders');
        }
    }
}

module.exports = ShopifyService;
