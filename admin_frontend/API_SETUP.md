# Market Admin Dashboard - API Integration Guide

## Environment Variables

Add these environment variables to your `.env.local` file:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

For production, update to your actual backend URL.

## Backend Requirements

The dashboard expects the following .NET API endpoints:

### Authentication
- `POST /api/Authentication/login` - Login with email and password
- `GET /api/Authentication/registration-admin` - Create admin account (accessible only if no admin exists)
- `GET /api/Authentication/registration` - Get all non-admin users (clients)

### Products
- `GET /api/ProductCrud/list` - Get all products
- `POST /api/ProductCrud/create-product` - Create new product (supports multipart form data for file upload)
- `POST /api/ProductCrud/update-product` - Update product details
- `POST /api/ProductCrud/delete-product` - Delete/mark product as out of stock

### Orders
- `POST /api/Cart/list-all-commande` - Get all orders (sends `{ UserId }`)
- `POST /api/Cart/accept-commande` - Accept an order (sends `{ commandeId }`)
- `POST /api/Cart/delete-commande` - Delete/cancel an order (sends `{ commandeId }`)

## Authentication Flow

1. User logs in with email and password
2. Backend returns `token` and `user` object
3. Token is stored in `localStorage` as `authToken`
4. Token is automatically included in all subsequent API requests via Authorization header

## Error Handling

- All API calls include built-in error handling
- Errors are displayed via toast notifications
- Network errors are caught and displayed to the user
- Unhandled API errors trigger a global error handler

## Features

- Responsive design (mobile, tablet, desktop)
- Real-time data updates
- Toast notifications for success/error feedback
- Protected routes with authentication guard
- Persistent authentication via localStorage
- 3D model support for products (.glb, .obj, .gltf)
- Charts and data visualization with Recharts
