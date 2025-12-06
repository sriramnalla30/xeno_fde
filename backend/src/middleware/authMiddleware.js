const jwt = require('jsonwebtoken');
const { Tenant } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'xeno-fde-secret-key-2025';

// Verify JWT token
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Get tenant from header (existing)
const getTenant = async (req, res, next) => {
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
    }

    try {
        const tenant = await Tenant.findByPk(tenantId);
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        req.tenant = tenant;
        next();
    } catch (error) {
        console.error('Error fetching tenant:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { authMiddleware, getTenant };
