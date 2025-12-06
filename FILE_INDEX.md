# POS System - File Index

## Root Directory Files
- `SETUP_GUIDE.md` - Complete setup and configuration guide
- `QUICK_START.md` - Quick reference and summary

## Backend (pos-backend/)

### Configuration Files
- `.env` - Environment variables (database, JWT, port)
- `.gitignore` - Git ignore rules
- `package.json` - Backend dependencies and scripts
- `tsconfig.json` - TypeScript configuration

### Source Files (src/)

#### Main Entry Point
- `src/index.ts` - Express server setup, routes, middleware

#### Controllers (Business Logic)
- `src/controllers/userController.ts` - User CRUD & authentication
- `src/controllers/categoryController.ts` - Category management
- `src/controllers/productController.ts` - Product management
- `src/controllers/orderController.ts` - Order management

#### Routes (API Endpoints)
- `src/routes/userRoutes.ts` - User endpoints
- `src/routes/categoryRoutes.ts` - Category endpoints
- `src/routes/productRoutes.ts` - Product endpoints
- `src/routes/orderRoutes.ts` - Order endpoints

#### Middleware
- `src/middleware/auth.ts` - JWT authentication & admin check

#### Configuration
- `src/config/jwt.ts` - JWT token generation & verification

#### Utilities
- `src/utils/response.ts` - Success/error response helpers
- `src/utils/errors.ts` - Error handling
- `src/utils/validation.ts` - Input validation rules

### Database
- `prisma/schema.prisma` - Database schema with all models
- `README.md` - Backend documentation

## Frontend (pos-frontend/)

### Configuration Files
- `.env` - Environment variables (API URL)
- `.gitignore` - Git ignore rules
- `package.json` - Frontend dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tsconfig.node.json` - TypeScript config for Node files
- `vite.config.ts` - Vite configuration with API proxy
- `index.html` - HTML template

### Source Files (src/)

#### Core
- `src/main.tsx` - React entry point
- `src/App.tsx` - Main app component with routing
- `src/styles/index.css` - Global styles

#### Components (Reusable UI)
- `src/components/Button.tsx` - Button variants
- `src/components/Input.tsx` - Form input
- `src/components/Select.tsx` - Dropdown select
- `src/components/Table.tsx` - Data table
- `src/components/Modal.tsx` - Modal dialog
- `src/components/Alert.tsx` - Alert messages
- `src/components/Loading.tsx` - Loading spinner
- `src/components/AlertDialog.tsx` - Custom alert dialog
- `src/components/ConfirmDialog.tsx` - Delete confirmation
- `src/components/ProtectedRoute.tsx` - Route protection

#### Pages (Ready for Implementation)
- `src/pages/` - Page components directory

#### Services (API Integration)
- `src/services/authService.ts` - User API calls
- `src/services/categoryService.ts` - Category API calls
- `src/services/productService.ts` - Product API calls
- `src/services/orderService.ts` - Order API calls

#### Hooks (Custom React Hooks)
- `src/hooks/useAsync.ts` - Async operation hook

#### Context (State Management)
- `src/context/authStore.ts` - Zustand auth store

#### Utilities
- `src/utils/axios.ts` - Axios instance with interceptors
- `src/utils/toast.ts` - Toast notification helpers

### Documentation
- `README.md` - Frontend documentation

---

## API Endpoints Summary

### Authentication
```
POST   /api/users/register
POST   /api/users/login
```

### User Management (Admin)
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Categories
```
POST   /api/categories
GET    /api/categories
GET    /api/categories/:id
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Products
```
POST   /api/products
GET    /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders
```
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id
DELETE /api/orders/:id
```

---

## Database Models

1. **User** - Users with roles (admin, cashier, manager)
2. **Category** - Product categories
3. **Product** - Products with inventory
4. **Order** - Sales orders
5. **OrderItem** - Order line items

---

## Key Features Implemented

✅ JWT Authentication
✅ Role-Based Access Control
✅ Full CRUD Operations
✅ Input Validation
✅ Error Handling
✅ Toast Notifications
✅ Confirmation Dialogs
✅ Protected Routes
✅ State Management
✅ API Interceptors
✅ Inventory Management
✅ Order Status Tracking

---

## Getting Started

1. Read `SETUP_GUIDE.md` for detailed setup instructions
2. Read `QUICK_START.md` for quick reference
3. Follow backend setup and migration steps
4. Follow frontend setup and run commands
5. Test API endpoints
6. Start building UI pages

---

## Development Commands

### Backend
```bash
npm run dev              # Start dev server with ts-node
npm run build           # Compile TypeScript
npm start               # Run compiled code
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
```

### Frontend
```bash
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Linting
```

---

**Total Files Created:** 40+
**Fully Functional:** ✅ Backend API
**Ready for Development:** ✅ Frontend Structure
