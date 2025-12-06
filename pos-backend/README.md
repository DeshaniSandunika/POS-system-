# POS Backend API

Point of Sale backend system built with Node.js, Express, JavaScript, and Prisma ORM with MySQL.

## Features

- JWT Authentication
- User Management (Register, Login, Get, Update, Delete)
- Category Management (Create, Read, Update, Delete)
- Product Management (Create, Read, Update, Delete)
- Order Management (Create, Read, Update Status, Delete)
- Input Validation with Express Validator
- Error Handling & Response Standardization
- CORS Support

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MySQL Server
- MySQL Workbench (for database management)

## Installation

1. Clone or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env` file:

```env
DATABASE_URL="mysql://root:password@localhost:3306/pos_db"
JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"
JWT_EXPIRY="7d"
PORT=5000
NODE_ENV="development"
```

4. Generate Prisma Client:

```bash
npm run prisma:generate
```

5. Run migrations:

```bash
npm run prisma:migrate
```

## Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Categories
- `POST /api/categories` - Create category (Admin only)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Products
- `POST /api/products` - Create product (Admin only)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Database Schema

The system includes the following models:
- **User**: Stores user information with roles (admin, cashier, manager)
- **Category**: Product categories
- **Product**: Products with inventory management
- **Order**: Sales orders
- **OrderItem**: Order line items

## Authentication

JWT tokens are used for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Development Tools

- View database with Prisma Studio:

```bash
npm run prisma:studio
```
