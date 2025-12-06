# POS Frontend

Point of Sale frontend system built with React, Vite, JavaScript (JSX), and Tailwind CSS.

## Features

- JWT Authentication
- Responsive UI with Tailwind CSS
- Toast notifications for user feedback
- Confirmation dialogs for delete operations
- Zustand for state management
- Axios for API calls
- Protected routes
- User-friendly interface

## Prerequisites

- Node.js (v16+)
- npm or yarn

## Installation

1. Navigate to the frontend directory
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components (.jsx)
├── pages/            # Page components (.jsx)
├── services/         # API services (.js)
├── hooks/            # Custom hooks (.js)
├── context/          # State management (Zustand)
├── utils/            # Utility functions (.js)
├── styles/           # CSS files
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## API Integration

All API calls are made through services in the `services` folder. Each service exports functions for CRUD operations:

- `authService` - User authentication
- `categoryService` - Category management
- `productService` - Product management
- `orderService` - Order management

## UI Components

Available reusable components (all in JSX):

- `Button` - Styled button with variants
- `Input` - Form input with validation
- `Select` - Dropdown select
- `Table` - Data table
- `Modal` - Modal dialog
- `Alert` - Alert messages
- `Loading` - Loading spinner
- `ConfirmDialog` - Confirmation dialog for delete operations
- `ProtectedRoute` - Route protection based on auth

## State Management

Using Zustand for state management:

- `useAuthStore` - Authentication state (user, token, login/logout)

## Toast Notifications

Toast utilities are available in `utils/toast.js`:

- `showSuccess()` - Show success message
- `showError()` - Show error message
- `showLoading()` - Show loading toast

## Development

The frontend includes:

- JavaScript/JSX for flexibility and simplicity
- Hot module replacement with Vite
- Tailwind CSS for styling
- React Router v6 for navigation
- Axios for API communication

## Component Examples

### Using Button Component

```jsx
import { Button } from './components/Button';

<Button variant="primary" size="md" onClick={() => console.log('clicked')}>
  Click Me
</Button>
```

### Using Input Component

```jsx
import { Input } from './components/Input';

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error={errors.email}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Using Table Component

```jsx
import { Table } from './components/Table';

<Table
  headers={['Name', 'Price', 'Actions']}
  data={products}
  renderRow={(product) => (
    <>
      <td className="border px-4 py-2">{product.name}</td>
      <td className="border px-4 py-2">${product.price}</td>
      <td className="border px-4 py-2">
        <Button onClick={() => handleEdit(product.id)}>Edit</Button>
      </td>
    </>
  )}
/>
```

## Service Examples

### Using Auth Service

```jsx
import { authService } from './services/authService';
import { useAuthStore } from './context/authStore';

const handleLogin = async (email, password) => {
  const response = await authService.login({ email, password });
  useAuthStore.getState().setToken(response.token);
  useAuthStore.getState().setUser(response.user);
};
```

### Using Product Service

```jsx
import { productService } from './services/productService';

// Get all products
const products = await productService.getAll();

// Create product
await productService.create({
  name: 'Product Name',
  price: 99.99,
  categoryId: 'cat-123'
});

// Update product
await productService.update('product-id', {
  price: 89.99
});

// Delete product
await productService.delete('product-id');
```

