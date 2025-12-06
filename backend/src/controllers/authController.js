const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

const JWT_SECRET = process.env.JWT_SECRET || 'xeno-fde-secret-key-2025';

const register = async (req, res) => {
    try {
        const { email, password, name, tenant_id } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Ensure default tenant exists
        const tenantIdToUse = tenant_id || 'demo-store';
        const [tenant] = await Tenant.findOrCreate({
            where: { id: tenantIdToUse },
            defaults: {
                id: tenantIdToUse,
                store_name: 'Demo Store',
                shopify_domain: process.env.SHOPIFY_STORE_DOMAIN || 'demo-store.myshopify.com',
                access_token: process.env.SHOPIFY_ACCESS_TOKEN || null,
            }
        });

        // Create user
        const user = await User.create({
            email,
            password,
            name,
            tenant_id: tenantIdToUse,
        });

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, email: user.email, name: user.name, tenant_id: user.tenant_id },
            token,
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, name: user.name, tenant_id: user.tenant_id },
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'name', 'tenant_id'],
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
};

module.exports = { register, login, getMe };
