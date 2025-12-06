# Shopify Data Insights Service

A multi-tenant data ingestion and analytics platform for Shopify stores. Built for enterprise retailers to onboard, integrate, and analyze their customer data.

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
| Database | MySQL |
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

## Database Schema

### Core Models
- **Tenant** - Store configuration and Shopify credentials
- **User** - Authentication with email/password
- **Customer** - Synced from Shopify
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

### Data Sync
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ingest | Sync data from Shopify |

## Multi-Tenancy

Each request includes `x-tenant-id` header for data isolation:
```
GET /api/dashboard/stats
Headers: x-tenant-id: your-store-id
```

## Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
PORT=3000
JWT_SECRET=your_secret_key
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
```

## Seeding Demo Data

```bash
cd backend
node seed.js
```

## License

MIT
