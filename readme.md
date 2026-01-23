# Node.js E-Commerce Backend API

A **production-ready e-commerce backend** built with **Node.js, Express, MongoDB (Mongoose), and TypeScript**.  
Designed with **real-world business logic**, **transaction safety**, **secure role-based access**, and **scalable architecture** in mind.

---

## Overview

This backend powers a complete e-commerce workflow including authentication, product & category management, search, cart handling, order processing, admin controls, image uploads, and transactional data safety.

It is **secure**, **scalable**, and **frontend-agnostic**.

---

## Core Features

### Authentication & Authorization
- JWT-based authentication
- Email-verified user signup
- Role-based access (**User**, **Admin**)
- Clean, reusable middleware separation
- Protected routes for sensitive operations

---

### Products & Categories
- Admin-only CRUD operations
- One image per product and category
- Cloudinary-based image uploads
- Soft deletes using `isActive`
- SEO-friendly slug generation
- Schema-level validation & references
- Public, user-safe product listing
- Indexed fields for scalable querying

---

### Product Search
- Backend support for frontend search bar
- Case-insensitive search
- MongoDB indexing for performance
- Pagination support
- Public endpoint (no authentication)

---

### Cart System
- One cart per user
- Add, update, remove, and clear items
- No stock manipulation at cart level
- Live product data via `populate`
- Authentication required
- Cart auto-cleared after successful order

---

### Orders
- Buy Now & Cart-based order creation
- MongoDB transactions for rollback safety
- Atomic stock enforcement
- Order snapshot (product name, price, quantity frozen)
- Delivery address stored per order
- User order history
- User-initiated cancellation with stock restoration
- Strict order state validation

---

### Admin Order Management
- View and manage all orders
- Secure order status updates
- Admin-initiated order cancellation
- Admin identity tracked
- Controlled order status transitions

---

### Transactions & Data Consistency
MongoDB sessions and transactions ensure:
- Consistent order creation
- Safe stock deduction
- Reliable cart clearing
- Order cancellation rollback
- Prevention of partial writes

---

### Image Handling
- Multer (memory storage)
- Cloudinary integration
- Automatic folder creation
- Image replacement supported
- Images not stored in MongoDB
- Optimized for scalability

---

## Tech Stack
- Node.js & Express
- TypeScript
- MongoDB & Mongoose
- JWT Authentication
- Multer & Cloudinary
- REST API architecture

---

## Installation

```bash
# Clone the repository
git clone https://github.com/ahmednagradev/ancart-backend.git
cd ancart-backend

# Install dependencies
npm install

# Create a .env file with your environment variables
# Example:  
PORT=your_port_number
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_email_account
GMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Start development server
npm run dev