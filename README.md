# Smart Inventory & Warehouse Management System

A full-stack web application for managing products, inventory, stock movements, suppliers, purchase orders, and warehouses.

This project is built using React.js, Node.js, Express.js, and SQLite. It includes JWT authentication, role-based access control, inventory management, stock tracking, supplier management, warehouse management, purchase orders, dashboards, and reports.

---

## 📌 Project Overview

The Smart Inventory & Warehouse Management System is a web-based application designed to simplify inventory and warehouse operations.

The application allows authorized users to:

- Manage products
- Track product inventory
- Perform stock IN operations
- Perform stock OUT operations
- Prevent negative stock
- Track stock movement history
- Manage suppliers
- Create purchase orders
- Receive purchase orders
- Manage warehouses
- Monitor low-stock products
- View inventory reports
- View stock movement reports
- Export report data
- Manage access using user roles

The project follows a frontend and backend architecture where the React frontend communicates with the Node.js and Express backend through REST APIs.

---

# 🚀 Features

## 🔐 Authentication & Authorization

- JWT-based authentication
- Secure login
- Protected routes
- Role-based access control
- Admin role
- Manager role
- Staff role
- Password hashing using bcrypt
- Authenticated API requests

---

## 📦 Product & Inventory Management

- View products
- Add products
- Edit products
- Delete products
- Product SKU management
- Product category management
- Product unit management
- Product price management
- Product quantity management
- Reorder level management
- Warehouse assignment
- Supplier assignment
- Low-stock identification
- Inventory filtering

---

## 🔄 Stock Management

- Stock IN
- Stock OUT
- Stock quantity validation
- Negative-stock prevention
- Stock movement tracking
- Warehouse tracking
- User tracking
- Movement reference
- Movement date tracking

---

## 🚚 Supplier Management

- Add suppliers
- View suppliers
- Edit suppliers
- Delete suppliers
- Supplier name
- Supplier email
- Supplier phone
- Supplier address

---

## 🧾 Purchase Order Management

- Create purchase orders
- Select supplier
- Select warehouse
- Select products
- Set product quantity
- Set product unit price
- View purchase orders
- Receive purchase orders
- Update inventory when purchase orders are received

---

## 🏢 Warehouse Management

- Add warehouses
- View warehouses
- Edit warehouses
- Delete warehouses
- Warehouse name
- Warehouse code
- Warehouse location
- Current stock information
- Product count
- Low-stock information

---

## 📊 Dashboard

The dashboard provides an overview of the inventory system.

It includes:

- Total products
- Current stock
- Low-stock products
- Out-of-stock information
- Warehouse count
- Supplier count
- Stock IN information
- Stock OUT information
- Inventory statistics
- Charts and visual information

---

## 📈 Reports

The application provides:

- Inventory reports
- Stock movement reports
- Low-stock reports
- CSV export

---

## 🎨 User Interface

The application includes:

- Responsive dashboard
- Sidebar navigation
- Login page
- Dashboard cards
- Tables
- Forms
- Modal windows
- Alerts
- Success messages
- Error messages
- Loading states
- Empty states
- Responsive layouts
- Mobile-friendly design

---

# 🛠️ Technology Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- Recharts
- Lucide React
- CSS

## Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- better-sqlite3

## Database

- SQLite

## Development Tools

- Git
- GitHub
- VS Code
- Postman
- npm

---

# 🏗️ Application Architecture

The application follows a frontend-backend architecture.

```text
                    Smart Inventory System
                            |
                            v
                    React Frontend
                            |
                            | Axios
                            v
                    Express REST API
                            |
                            v
               Authentication / Authorization
                            |
                            v
                  Controllers / Routes
                            |
                            v
                    SQLite Database
                            |
                            v
                 Inventory / Stock Data
                            |
                            v
                    API Response
                            |
                            v
                    React User Interface

📁 Project Structure

SmartInventoryWarehouse/
|
├── frontend/
|   |
|   ├── src/
|   |   |
|   |   ├── components/
|   |   |   └── common/
|   |   |
|   |   ├── layouts/
|   |   |
|   |   ├── pages/
|   |   |   ├── Dashboard.jsx
|   |   |   ├── Inventory.jsx
|   |   |   ├── StockMovements.jsx
|   |   |   ├── Suppliers.jsx
|   |   |   ├── PurchaseOrders.jsx
|   |   |   ├── Warehouses.jsx
|   |   |   ├── Reports.jsx
|   |   |   ├── Profile.jsx
|   |   |   └── Login.jsx
|   |   |
|   |   ├── routes/
|   |   |
|   |   ├── services/
|   |   |
|   |   ├── App.jsx
|   |   └── index.css
|   |
|   ├── .env.example
|   ├── package.json
|   └── vite.config.js
|
├── backend/
|   |
|   ├── database/
|   |   ├── db.js
|   |   ├── schema.sql
|   |   └── seed.js
|   |
|   ├── src/
|   |   ├── config/
|   |   ├── controllers/
|   |   ├── middleware/
|   |   ├── routes/
|   |   └── utils/
|   |
|   ├── .env.example
|   ├── package.json
|   └── server.js
|
├── .gitignore
└── README.md

🗄️ Database

The application uses SQLite as its database.

The database contains the following main tables:

users
products
warehouses
suppliers
stock_movements
purchase_orders
purchase_order_items
inventory_logs
Users Table

The users table stores application users.

It contains information such as:

User ID
Name
Email
Password hash
Role
Created date

Supported roles:

admin
manager
staff
Products Table

The products table stores inventory product information.

It includes:

Product ID
SKU
Product name
Category
Unit
Quantity
Reorder level
Warehouse
Supplier
Price
Created date
Updated date
Warehouses Table

The warehouses table stores warehouse information.

It includes:

Warehouse ID
Warehouse name
Warehouse code
Location
Created date
Suppliers Table

The suppliers table stores supplier information.

It includes:

Supplier ID
Supplier name
Email
Phone
Address
Created date
Stock Movements Table

The stock movements table stores inventory movement information.

It includes:

Movement ID
Product
Warehouse
Movement type
Quantity
Reference
User
Created date

Movement types are:

IN
OUT
Purchase Orders Table

The purchase orders table stores purchase order information.

It includes:

Purchase order ID
Purchase order number
Supplier
Warehouse
Status
Total amount
Ordered date
Received date
Purchase Order Items Table

The purchase order items table stores products included in purchase orders.

It includes:

Item ID
Purchase order
Product
Quantity
Unit price
Inventory Logs Table

The inventory logs table stores inventory-related audit information.

It includes:

Log ID
Product
Action
Details
User
Created date
🔐 User Roles

The application supports three user roles.

👑 Admin

Admin users can access the major inventory management features.

Admin functionality includes:

Product management
Inventory management
Stock management
Supplier management
Purchase order management
Warehouse management
Reports
👨‍💼 Manager

Manager users can work with inventory operations and management features according to their assigned permissions.

Manager functionality includes:

Inventory management
Stock operations
Supplier management
Purchase orders
Reports
👷 Staff

Staff users can access permitted inventory and stock-related functionality according to their assigned permissions.

👤 Demo Credentials

The application includes demo users for testing.

Role	Email	Password
Admin	admin@inventory.local	Admin@123
Manager	manager@inventory.local	Manager@123
Staff	staff@inventory.local	Staff@123

These credentials are intended for local development and testing.

Passwords are stored using bcrypt hashing.

⚙️ Installation
Requirements

Before running the project, install:

Node.js 18 or later
npm
Git
VS Code
1. Clone the Repository

Clone the GitHub repository:

git clone https://github.com/Pavani-2116/SmartInventoryWarehouse.git

Move into the project directory:

cd SmartInventoryWarehouse
2. Backend Setup

Open a terminal and go to the backend folder:

cd backend

Install backend dependencies:

npm install
Create Backend Environment File
Windows
copy .env.example .env
macOS / Linux
cp .env.example .env
Initialize Database

Run:

npm run db:init

This creates the SQLite database and database tables.

Add Demo Data

Run:

npm run db:seed

This inserts demo users, products, suppliers, warehouses, and other sample data.

Start Backend

Run:

npm run dev

The backend runs at:

http://localhost:5000
3. Frontend Setup

Open another terminal.

From the project root, go to the frontend:

cd frontend

Install frontend dependencies:

npm install
Create Frontend Environment File
Windows
copy .env.example .env
macOS / Linux
cp .env.example .env
Start Frontend

Run:

npm run dev

The frontend normally runs at:

http://localhost:5173
🔑 Environment Variables
Backend .env
PORT=5000
DATABASE_PATH=./database/inventory.sqlite
JWT_SECRET=change-this-in-production
CLIENT_URL=http://localhost:5173
Frontend .env
VITE_API_URL=http://localhost:5000/api

Do not commit .env files or real production secrets to GitHub.

📊 Dashboard

The dashboard provides a centralized view of the inventory system.

It displays:

Total products
Total stock
Low-stock products
Out-of-stock information
Warehouse count
Supplier count
Stock IN information
Stock OUT information
Inventory statistics
Charts

The dashboard helps users quickly understand the current inventory situation.

📦 Inventory Management

The Inventory page allows authorized users to manage products.

Users can:

View products
Add products
Edit products
Delete products
View product SKU
View product category
View product quantity
View product price
View warehouse
View supplier
Filter inventory
Identify low-stock products
🔄 Stock Management

The system supports two main stock operations.

Stock IN

Stock IN increases the available stock of a product.

Example:

Current Stock = 10
Stock IN = 5

New Stock = 15
Stock OUT

Stock OUT decreases the available stock.

Example:

Current Stock = 10
Stock OUT = 3

New Stock = 7
🚫 Negative Stock Prevention

The system prevents users from removing more stock than is currently available.

For example:

Current Stock = 10
Requested Stock OUT = 15

The operation is rejected.

The stock remains:

10

This prevents negative inventory quantities.

📋 Stock Movement History

The Stock Movements page provides a history of inventory operations.

Each movement contains information such as:

Product
Movement type
Quantity
Warehouse
User
Reference
Date

Movement types include:

IN
OUT

This creates an audit trail for inventory changes.

🏢 Warehouse Management

The Warehouse page allows authorized users to manage warehouses.

Warehouse information includes:

Warehouse name
Warehouse code
Location
Current stock
Product count
Low-stock information

Users can:

Add warehouses
View warehouses
Edit warehouses
Delete warehouses
🚚 Supplier Management

The Supplier page allows users to manage supplier information.

Supplier information includes:

Supplier name
Email
Phone
Address

Available operations:

Add supplier
View supplier
Edit supplier
Delete supplier
🧾 Purchase Orders

The Purchase Orders page allows users to manage product purchasing.

Users can:

Create purchase orders
Select suppliers
Select warehouses
Select products
Set product quantities
Set unit prices
View purchase orders
Receive purchase orders

When a purchase order is received, the backend updates the inventory.

📈 Reports

The Reports page provides inventory information and stock-related reports.

Available reports include:

Inventory report
Stock movement report
Low-stock report

The application also supports CSV export for report data.

🔗 REST API

The frontend communicates with the backend through REST APIs.

Authentication APIs
POST /api/auth/login
GET  /api/auth/me
Product APIs
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
Stock APIs
POST /api/stock/in
POST /api/stock/out
GET  /api/stock/movements
Supplier APIs
GET    /api/suppliers
POST   /api/suppliers
PUT    /api/suppliers/:id
DELETE /api/suppliers/:id
Warehouse APIs
GET    /api/warehouses
POST   /api/warehouses
PUT    /api/warehouses/:id
DELETE /api/warehouses/:id
Purchase Order APIs
GET  /api/purchase-orders
POST /api/purchase-orders
PUT  /api/purchase-orders/:id
Dashboard API
GET /api/dashboard/summary
Reports APIs
GET /api/reports/inventory
GET /api/reports/movements
GET /api/reports/low-stock
🔒 Security

The application includes:

JWT authentication
Password hashing using bcrypt
Protected frontend routes
Protected backend APIs
Role-based authorization
Backend validation
SQLite constraints
Negative-stock prevention
Environment variables for configuration

Sensitive environment files are excluded from Git.

Local SQLite database files are also excluded from Git.


🌐 GitHub Repository

Repository:

https://github.com/Pavani-2116/SmartInventoryWarehouse

🚀 Future Enhancements

Possible future improvements include:

Real barcode scanner integration
Camera-based barcode scanning
Warehouse-to-warehouse stock transfers
Advanced inventory analytics
Automated low-stock notifications
Predictive restocking
PDF report generation
Email notifications
Fine-grained user permissions
Cloud database support
Advanced dashboard analytics
Inventory forecasting
Automated purchase recommendations
💡 Learning Outcomes

This project demonstrates practical knowledge of:

React.js
Component-based development
React Router
REST API integration
Axios
Node.js
Express.js
JWT authentication
Role-based authorization
Password hashing
SQLite
SQL database design
CRUD operations
Inventory management
Stock validation
API development
Git
GitHub
Environment variables
Responsive UI development
Production builds
👩‍💻 Author
Pavani Mada

B.Tech Computer Science Engineering

GitHub

https://github.com/Pavani-2116

Project Repository

https://github.com/Pavani-2116/SmartInventoryWarehouse

📄 License

This project was developed for learning, demonstration, and evaluation purposes.


**This is the complete README in one block.** Copy the whole block into `README.md`, replacing the old content.