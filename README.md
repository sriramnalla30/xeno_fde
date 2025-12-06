# Xeno FDE - Shopify Data Insights Platform

A multi-tenant data ingestion and analytics platform for Shopify stores. Built for enterprise retailers to onboard, integrate, and analyze their customer data.

## 🚀 Live Demo

| Component | URL |
|-----------|-----|
| **Frontend** | https://xeno-fde-sriram.netlify.app |
| **Backend API** | https://xeno-fde-backend-grgh.onrender.com |

> ⚠️ **Note**: Render free tier spins down after inactivity. First request may take ~30s to wake up.

---

## 🔗 Shopify Integration Proof

This application connects to a **real Shopify development store** via the Shopify Admin API.

### Connected Store Details
| Property | Value |
|----------|-------|
| **Store Domain** | `sriram-dev-studio.myshopify.com` |
| **API Version** | `2024-01` |
| **Integration Type** | REST Admin API |

### How Data Flows
1. Click **"Sync Data"** button on the dashboard
2. Backend calls Shopify Admin API endpoints:
   - `GET /admin/api/2024-01/products.json`
   - `GET /admin/api/2024-01/customers.json`
   - `GET /admin/api/2024-01/orders.json`
3. Data is stored in MySQL with `tenant_id` for isolation
4. Dashboard displays synced data with Shopify-native fields

### Shopify-Specific Data Fields
The data contains Shopify-native fields that prove API integration:
- **Order IDs**: Shopify's auto-generated order numbers
- **created_at_shopify**: Timestamps from Shopify's system
- **financial_status**: Shopify payment statuses (`paid`, `pending`, `refunded`)
- **orders_count** & **total_spent**: Shopify's customer analytics

---

## Features

- **Multi-Tenant Architecture** - Isolated data per store with tenant identifiers
- **Real-Time Data Ingestion** - Sync products, customers, and orders from Shopify
- **Analytics Dashboard** - Revenue trends, order analytics, and customer insights
- **Email Authentication** - JWT-based login/registration system
- **RESTful API** - Clean API design for data access

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js, Sequelize |
| Frontend | React (Vite), Tailwind CSS |
| Database | MySQL (Aiven Cloud) |
| Hosting | Render (Backend), Netlify (Frontend) |
| Charts | Recharts |
| Auth | JWT, bcryptjs |

## Quick Start

### Prerequisites
- Node.js v18+
- MySQL 8.0+

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access
- Frontend: http://localhost:5174
- Backend API: http://localhost:3000

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # API logic
│   │   ├── middleware/     # Auth & tenant middleware
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   └── services/       # Shopify service
│   └── seed.js             # Demo data seeder
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page views
│   │   └── services/       # API client
│   └── index.html
└── README.md
```

## Database Schema (MySQL)

### Core Models
- **Tenant** - Store configuration and Shopify credentials
- **User** - Authentication with email/password
- **Customer** - Synced from Shopify API
- **Order** - Order data with financial status
- **Product** - Product catalog

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard/stats | Summary metrics |
| GET | /api/dashboard/orders | Order list |
| GET | /api/dashboard/orders-by-date | Orders grouped by date |
| GET | /api/dashboard/top-customers | Top customers |
| GET | /api/dashboard/products | Product list |

### Data Sync (Shopify Integration)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ingest | Sync data from Shopify Admin API |

## Multi-Tenancy

Each request includes `x-tenant-id` header for data isolation:
```
GET /api/dashboard/stats
Headers: x-tenant-id: your-store-id
```

## Environment Variables

```env
DATABASE_URL=mysql://user:pass@host:port/database
PORT=3000
JWT_SECRET=your_secret_key
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_API_VERSION=2024-01
```

## Author

**Sriram Nalla** - [GitHub](https://github.com/sriramnalla30)

## License

MIT
