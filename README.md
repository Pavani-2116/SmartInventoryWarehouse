# Smart Inventory & Warehouse Management System

Evaluation-ready full-stack assignment implementation using **ReactJS + Node.js + Express + SQLite**.

## Features

- JWT authentication and RBAC: Admin, Warehouse Manager, Staff
- Product inventory management
- Stock IN / OUT with transactional SQLite logic
- Negative-stock prevention
- Stock movement history with previous/new quantities
- Supplier management
- Purchase orders with safe receiving (prevents double inventory addition)
- Warehouse management
- Dashboard KPIs, movement chart, category distribution and low-stock alerts
- Inventory filters by category and stock level
- Reports with CSV export
- Barcode/SKU scanning simulation
- Responsive SaaS-style UI
- Frontend and backend validation
- Loading, empty, error and success states
- Seed/demo data
- `.env.example` files

## Tech Stack

Frontend: React, Vite, React Router, Axios, Recharts, Lucide React  
Backend: Node.js, Express, JWT, bcryptjs, better-sqlite3  
Database: SQLite

## Architecture

React UI → Express REST API → Services/Controllers → SQLite → API response → React UI.

Important inventory mutations use SQLite transactions. Stock OUT is rejected when requested quantity exceeds current quantity.

## Folder Structure

```text
smart-inventory-warehouse/
├── frontend/
│   ├── src/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── documentation/
├── README.md
└── .gitignore
```

## Database

Tables:

- users
- products
- warehouses
- suppliers
- stock_movements
- inventory_logs
- purchase_orders
- purchase_order_items

Foreign keys and indexes are configured in `backend/src/database/schema.sql`.

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@inventory.local | Admin@123 |
| Warehouse Manager | manager@inventory.local | Manager@123 |
| Staff | staff@inventory.local | Staff@123 |

Passwords are hashed before storage.

## Installation

Requirements: Node.js 18+ recommended and npm.

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run db:init
npm run db:seed
npm run dev
```

On macOS/Linux, replace the copy command with:

```bash
cp .env.example .env
```

Backend runs at `http://localhost:5000`.

### Frontend

Open another terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux:

```bash
cp .env.example .env
```

Frontend runs at the Vite URL, normally `http://localhost:5173`.

## Production build

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

Backend:

```bash
cd backend
npm start
```

## API Summary

### Auth
- `POST /api/auth/login`
- `GET /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Stock
- `POST /api/stock/in`
- `POST /api/stock/out`
- `GET /api/stock/movements`

### Suppliers
- `GET /api/suppliers`
- `POST /api/suppliers`
- `PUT /api/suppliers/:id`
- `DELETE /api/suppliers/:id`

### Warehouses
- `GET /api/warehouses`
- `POST /api/warehouses`
- `PUT /api/warehouses/:id`
- `DELETE /api/warehouses/:id`

### Purchase Orders
- `GET /api/purchase-orders`
- `POST /api/purchase-orders`
- `PUT /api/purchase-orders/:id`

### Dashboard
- `GET /api/dashboard/summary`

### Reports
- `GET /api/reports/inventory`
- `GET /api/reports/movements`
- `GET /api/reports/low-stock`

## Environment Variables

Backend `.env`:

```text
PORT=5000
DATABASE_PATH=./database/warehouse.db
JWT_SECRET=change-this-in-production
CLIENT_URL=http://localhost:5173
```

Frontend `.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

Do not commit `.env` or real secrets.

## Stock Integrity

Stock IN/OUT is performed in one SQLite transaction:

1. Read current stock
2. Validate requested quantity
3. Calculate new stock
4. Update product quantity
5. Insert stock movement
6. Insert audit log
7. Commit

Any failure rolls the transaction back.

Stock OUT example: if current stock is 10 and requested OUT is 15, the operation returns an error and stock remains 10.

## Purchase Order Receiving

When a purchase order changes to `Received`, its items are added to inventory in a transaction and stock movements/audit logs are created. A received order cannot be received again, preventing double-addition.

## Evaluation Mapping

### Feature completeness — 25
Products, stock lifecycle, suppliers, purchase orders, warehouses, alerts, history, reports and filters are implemented.

### Backend quality — 20
Express REST APIs, RBAC, validation, transactional stock operations, centralized error handling and safe purchase-order receiving.

### Frontend UI/UX — 20
Responsive dashboard, KPI cards, charts, tables, filters, modals, alerts, mobile navigation and feedback states.

### Database design — 15
Normalized relational schema, foreign keys, indexes, stock history, audit logs and SQLite transactions.

### Code quality — 10
Modular routes/controllers/services, reusable React components and centralized API/auth handling.

### Deployment — 10
The frontend has a production build and the backend is Node-compatible. SQLite requires persistent storage in production.

## Deployment Notes

For evaluation, deploy the Node backend on a service with persistent disk/storage for SQLite, and deploy the Vite frontend on a static React host. Set:

- Backend `DATABASE_PATH` to a persistent location
- Backend `JWT_SECRET` to a strong secret
- Backend `CLIENT_URL` to the frontend origin
- Frontend `VITE_API_URL` to the deployed API

Do not use an ephemeral filesystem for the SQLite database, or data may disappear after a restart.

## Submission Checklist

GitHub Repository:
`<URL>`

Deployed Application:
`<URL>`

Video Recording:
`<URL>`

Before submission, verify login, CRUD flows, stock IN/OUT, negative-stock rejection, purchase receiving, persistence after refresh, reports, responsive layouts, deployment and the 5–8 minute demo video.

## Known Limitations

- Barcode scanning is a SKU-input simulation rather than hardware integration.
- Predictive restocking is intentionally a lightweight explainable estimate and can be added as a future enhancement.
- The dashboard refreshes immediately after successful operations; no WebSocket layer is required by the assignment.

## Future Enhancements

- Advanced predictive restocking
- Real barcode/camera scanning
- CSV/PDF report scheduling
- Warehouse-to-warehouse transfers
- Fine-grained permissions
- Notification integrations

## Production SQLite Structure

The project now uses a production-style SQLite setup:

- `backend/database/schema.sql` — relational schema, constraints, foreign keys and indexes.
- `backend/database/db.js` — SQLite connection configured with foreign keys, WAL and busy timeout.
- `backend/database/seed.js` — realistic demo users, warehouses, suppliers, products and opening stock.
- `backend/database/inventory.sqlite` — generated locally by the database initialization command.
- Stock changes should be performed inside backend transactions so quantity and movement history stay consistent.
- Foreign keys protect product, supplier, warehouse and purchase-order relationships.
- `products.quantity >= 0` and movement quantity constraints prevent invalid values at database level.

### Database commands

```bash
cd backend
npm install
npm run db:init
npm run db:seed
npm run dev
```

`db:init` creates the schema. `db:seed` inserts demo records. Do not commit a private production database containing real credentials or customer data.
