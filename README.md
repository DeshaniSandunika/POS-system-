# 🏪 POS (Point of Sale) System

A complete, production-ready Point of Sale system built with modern web technologies. This system manages products, categories, orders with inventory tracking, and user authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [File Directory](#file-directory)
- [Setup Instructions](#setup-instructions)
- [Development](#development)
- [Deployment](#deployment)

## ✨ Features

### Backend API
- ✅ **JWT Authentication** - Secure user authentication with token-based access
- ✅ **User Management** - Register, login, get users, update, delete (admin only)
- ✅ **Category Management** - Full CRUD for product categories
- ✅ **Product Management** - Full CRUD for products with inventory tracking
- ✅ **Order Management** - Create orders, track status, manage line items
- ✅ **Inventory Management** - Automatic stock updates when orders are created/deleted
- ✅ **Input Validation** - Comprehensive validation on all endpoints
- ✅ **Error Handling** - Standardized error responses
- ✅ **Role-Based Access** - Admin-only operations
- ✅ **CORS Support** - Cross-origin requests enabled

### Frontend UI
- ✅ **Authentication System** - Login/register with JWT
- ✅ **Protected Routes** - Route protection based on auth status
- ✅ **Reusable Components** - Button, Input, Select, Table, Modal, Alert
- ✅ **Toast Notifications** - Success/error feedback to user
- ✅ **Confirmation Dialogs** - Confirmation for delete operations
- ✅ **State Management** - Zustand for auth state
- ✅ **API Integration** - Axios with automatic token injection
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type-safe JavaScript |
| Prisma | ORM for database |
| MySQL | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| CORS | Cross-origin support |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI library |
| Vite | Build tool |
| TypeScript | Type-safe JavaScript |
| React Router v6 | Routing |
| Zustand | State management |
| Axios | HTTP client |
| Tailwind CSS | Styling |
| React Hot Toast | Notifications |
| Lucide React | Icons |

## 📁 Project Structure

```
pos/
├── pos-backend/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/         # Business logic
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Auth middleware
│   │   ├── config/              # Configuration
│   │   ├── utils/               # Utilities
│   │   └── index.ts             # Main server
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── pos-frontend/                # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── hooks/               # Custom hooks
│   │   ├── context/             # State management
│   │   ├── utils/               # Utilities
│   │   ├── styles/              # CSS files
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env                     # Environment variables
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
│
├── SETUP_GUIDE.md               # Detailed setup guide
├── QUICK_START.md               # Quick reference
├── FILE_INDEX.md                # File directory
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MySQL Server
- npm or yarn

### Backend Setup (5 minutes)

```bash
# 1. Navigate to backend directory
cd pos-backend

# 2. Install dependencies
npm install

# 3. Create MySQL database
mysql -u root -p
> CREATE DATABASE pos_db;
> EXIT;

# 4. Configure environment (.env)
# Update DATABASE_URL with your MySQL credentials

# 5. Generate Prisma and run migrations
npm run prisma:generate
npm run prisma:migrate

# 6. Start the server
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup (5 minutes)

```bash
# 1. Navigate to frontend directory
cd pos-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# Frontend runs on http://localhost:3000
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | Login user | No |

### Users (Admin only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Get all users | Yes (Admin) |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PUT | `/api/users/:id` | Update user | Yes (Admin) |
| DELETE | `/api/users/:id` | Delete user | Yes (Admin) |

### Categories
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/categories` | Create category | Yes (Admin) |
| GET | `/api/categories` | Get all categories | Yes |
| GET | `/api/categories/:id` | Get category by ID | Yes |
| PUT | `/api/categories/:id` | Update category | Yes (Admin) |
| DELETE | `/api/categories/:id` | Delete category | Yes (Admin) |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/products` | Create product | Yes (Admin) |
| GET | `/api/products` | Get all products | Yes |
| GET | `/api/products/:id` | Get product by ID | Yes |
| PUT | `/api/products/:id` | Update product | Yes (Admin) |
| DELETE | `/api/products/:id` | Delete product | Yes (Admin) |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order | Yes |
| GET | `/api/orders` | Get all orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |
| PUT | `/api/orders/:id` | Update order status | Yes |
| DELETE | `/api/orders/:id` | Delete order | Yes |

## 💾 Database Schema

### User
```
- id (CUID)
- email (UNIQUE)
- password (hashed)
- name
- role (admin, cashier, manager)
- createdAt
- updatedAt
```

### Category
```
- id (CUID)
- name (UNIQUE)
- description
- products (relation)
- createdAt
- updatedAt
```

### Product
```
- id (CUID)
- name
- description
- price
- quantity
- categoryId (foreign key)
- category (relation)
- orderItems (relation)
- createdAt
- updatedAt
```

### Order
```
- id (CUID)
- orderNumber (UNIQUE)
- totalAmount
- status (pending, completed, cancelled)
- items (relation)
- createdAt
- updatedAt
```

### OrderItem
```
- id (CUID)
- quantity
- price
- orderId (foreign key)
- productId (foreign key)
- order (relation)
- product (relation)
- createdAt
- updatedAt
```

## 📂 File Directory

See `FILE_INDEX.md` for complete file listing.

### Key Backend Files
- `src/index.ts` - Express server
- `src/controllers/*` - Business logic
- `src/routes/*` - API endpoints
- `src/middleware/auth.ts` - JWT authentication
- `src/utils/validation.ts` - Input validation
- `prisma/schema.prisma` - Database schema

### Key Frontend Files
- `src/App.tsx` - Main component
- `src/services/*` - API integration
- `src/components/*` - Reusable UI
- `src/context/authStore.ts` - State management
- `src/utils/axios.ts` - HTTP client
- `src/utils/toast.ts` - Notifications

## 📖 Setup Instructions

### Detailed Setup
See `SETUP_GUIDE.md` for comprehensive setup instructions.

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="mysql://root:password@localhost:3306/pos_db"
JWT_SECRET="your_super_secret_key_change_in_production"
JWT_EXPIRY="7d"
PORT=5000
NODE_ENV="development"
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🔧 Development

### Backend Commands
```bash
npm run dev              # Start dev server
npm run build            # Compile TypeScript
npm start                # Run compiled code
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)
```

### Frontend Commands
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run linting
```

## 🧪 Testing Endpoints

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

### Create Category
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices"
  }'
```

## 📦 Dependencies

### Backend
- express
- @prisma/client
- jsonwebtoken
- bcryptjs
- express-validator
- cors
- dotenv

### Frontend
- react
- react-dom
- react-router-dom
- axios
- zustand
- react-hot-toast
- lucide-react
- tailwind css

## 🔐 Security Features

✅ Password hashing with bcryptjs
✅ JWT token validation with expiry
✅ Role-based access control
✅ Input validation on backend
✅ CORS protection
✅ Environment variable protection
✅ SQL injection prevention (via Prisma)

## 📚 Documentation

- `README.md` (this file) - Project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `QUICK_START.md` - Quick reference guide
- `FILE_INDEX.md` - File structure
- `pos-backend/README.md` - Backend documentation
- `pos-frontend/README.md` - Frontend documentation

## 🚢 Deployment

### Backend Deployment
1. Build: `npm run build`
2. Set environment variables
3. Run migrations: `npm run prisma:migrate`
4. Start: `npm start`

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist` folder to static hosting
3. Configure VITE_API_URL for production

## 🐛 Troubleshooting

### Backend Issues
- **MySQL Connection Error**: Check DATABASE_URL in .env
- **Port Already in Use**: Change PORT in .env
- **Migration Failed**: Run `npm run prisma:generate` first

### Frontend Issues
- **API Not Found**: Ensure backend is running on port 5000
- **Module Not Found**: Run `npm install` again
- **CORS Error**: Check backend CORS configuration

## 📝 Future Enhancements

- [ ] Dashboard with sales analytics
- [ ] Product image uploads
- [ ] Advanced reporting
- [ ] Payment integration
- [ ] Receipt printing
- [ ] Barcode scanning
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app
- [ ] Real-time inventory updates

## 👥 User Roles

- **Admin**: Full access to all operations
- **Cashier**: Can create orders and view products
- **Manager**: Can view orders and analytics

## 📞 Support

For detailed information:
1. Read `SETUP_GUIDE.md` for setup help
2. Check `FILE_INDEX.md` for file locations
3. Review individual README files in backend/frontend folders

## 📄 License

This project is open source and available for personal and commercial use.

---

**Status:** ✅ Production Ready Backend | ✅ Frontend Structure Complete

**Last Updated:** December 2025

**Total Files:** 40+

**Lines of Code:** 2000+
