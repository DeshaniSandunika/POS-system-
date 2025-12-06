# POS System - Setup Guide

## Project Overview

This is a complete Point of Sale (POS) system with:
- **Backend**: Node.js + Express + TypeScript + Prisma ORM + MySQL
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Authentication**: JWT
- **Features**: Categories, Products, Orders with full CRUD operations

## Folder Structure

```
pos/
├── pos-backend/
│   ├── src/
│   │   ├── controllers/        # Business logic for routes
│   │   │   ├── userController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── productController.ts
│   │   │   └── orderController.ts
│   │   ├── routes/             # API routes
│   │   │   ├── userRoutes.ts
│   │   │   ├── categoryRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   └── orderRoutes.ts
│   │   ├── middleware/         # Custom middleware
│   │   │   └── auth.ts
│   │   ├── config/             # Configuration files
│   │   │   └── jwt.ts
│   │   ├── utils/              # Utility functions
│   │   │   ├── response.ts     # Success/error responses
│   │   │   ├── errors.ts       # Error handling
│   │   │   └── validation.ts   # Input validation
│   │   └── index.ts            # Main server file
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── .env                    # Environment variables
│   ├── tsconfig.json           # TypeScript config
│   ├── package.json
│   └── README.md
│
└── pos-frontend/
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── pages/              # Page components
    │   ├── services/           # API services
    │   │   ├── authService.ts
    │   │   ├── categoryService.ts
    │   │   ├── productService.ts
    │   │   └── orderService.ts
    │   ├── hooks/              # Custom React hooks
    │   │   └── useAsync.ts
    │   ├── context/            # State management
    │   │   └── authStore.ts    # Zustand auth store
    │   ├── utils/              # Utilities
    │   │   ├── axios.ts        # Axios instance
    │   │   └── toast.ts        # Toast notifications
    │   ├── styles/             # CSS files
    │   ├── App.tsx
    │   └── main.tsx
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── package.json
    └── README.md
```

## Backend Setup Instructions

### 1. Install Dependencies

```bash
cd pos-backend
npm install
```

### 2. Configure Database

Update `.env` with your MySQL credentials:

```env
DATABASE_URL="mysql://root:password@localhost:3306/pos_db"
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRY="7d"
PORT=5000
NODE_ENV="development"
```

**Note:** Create the database first:
```sql
CREATE DATABASE pos_db;
```

### 3. Generate Prisma Client & Run Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Frontend Setup Instructions

### 1. Install Dependencies

```bash
cd pos-frontend
npm install
```

### 2. Start Frontend Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### User Management (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Categories (Admin only for create/update/delete)
- `POST /api/categories` - Create category
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category details
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products (Admin only for create/update/delete)
- `POST /api/products` - Create product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

## Features Implemented

### Backend
✅ JWT Authentication with role-based access control
✅ User management (Register, Login, Get, Update, Delete)
✅ Category management with CRUD operations
✅ Product management with inventory tracking
✅ Order management with automatic inventory updates
✅ Input validation using express-validator
✅ Error handling with standardized responses
✅ Prisma ORM with MySQL integration
✅ CORS support

### Frontend
✅ Authentication system with token management
✅ Protected routes
✅ Reusable UI components
✅ Toast notifications for success/error messages
✅ Confirmation dialogs for delete operations
✅ State management with Zustand
✅ API integration with interceptors
✅ Responsive design with Tailwind CSS

## Next Steps

1. Implement login and register pages
2. Create dashboard layout and navigation
3. Build category management interface
4. Build product management interface
5. Build order creation and management interface
6. Add user management interface (admin panel)
7. Enhance UI with advanced Tailwind components
8. Add more validation and error handling

## Technologies Used

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

### Frontend
- React 18
- Vite
- TypeScript
- React Router v6
- Zustand
- Axios
- Tailwind CSS
- React Hot Toast
- Lucide React Icons

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://root:password@localhost:3306/pos_db"
JWT_SECRET="your_secret_key"
JWT_EXPIRY="7d"
PORT=5000
NODE_ENV="development"
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Testing the Backend

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pos.com",
    "password": "password123",
    "name": "Admin User",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pos.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Backend Issues
- Make sure MySQL is running
- Check DATABASE_URL in .env
- Run migrations: `npm run prisma:migrate`
- View database: `npm run prisma:studio`

### Frontend Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check VITE_API_URL in .env
- Ensure backend is running on port 5000

## Support

For issues or questions, refer to:
- Backend: `pos-backend/README.md`
- Frontend: `pos-frontend/README.md`
