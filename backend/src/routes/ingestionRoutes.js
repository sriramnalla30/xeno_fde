const express = require('express');
const router = express.Router();
const { getTenant } = require('../middleware/authMiddleware');
const { ingestData } = require('../controllers/ingestionController');

router.post('/ingest', getTenant, ingestData);

module.exports = router;
