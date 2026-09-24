# 🛒 VIPcart — Full Stack MERN E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vipstore--ecom.onrender.com-blue?style=for-the-badge&logo=render)](https://vipstore-ecom.onrender.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

VIPcart is a production-ready, full-stack e-commerce web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It delivers a complete online shopping experience — from user authentication and product browsing to secure payments and admin order management.

---

## ✨ Features

### 👤 User
- Register & login with **JWT authentication**
- Manage profile and password
- Browse, search, and filter products
- Add/remove items from **cart**
- Checkout with shipping details
- Secure payments via **Stripe** & **Razorpay**
- View **order history** and real-time order status
- Write **product reviews** and star ratings

### 🛍️ Product
- Product listing with images (hosted on **Cloudinary**)
- Detailed product pages
- Search and category filters
- Stock availability tracking

### 🛠️ Admin
- Admin dashboard with stats
- **CRUD** operations on products
- Manage user roles
- View and update order statuses

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Redux Toolkit, React Router v7 |
| **UI** | React Bootstrap, Custom CSS, Lucide Icons |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | JWT, Passport.js (Google OAuth) |
| **Payments** | Stripe, Razorpay |
| **Media** | Cloudinary (image uploads) |
| **Email** | Nodemailer |
| **Deployment** | Render (backend + frontend), MongoDB Atlas |

---

## 📁 Project Structure

```
eccomerce/
└── Ecommerce-Website/
    ├── backend/          # Express API server
    │   ├── config/       # DB & env config
    │   ├── controllers/  # Route controllers
    │   ├── middlewares/  # Auth, error handlers
    │   ├── models/       # Mongoose schemas
    │   ├── routes/       # API routes
    │   ├── utils/        # Helpers & seeder
    │   └── server.js     # Entry point
    └── frontend/         # React client app
        ├── public/
        └── src/
            ├── actions/  # Redux actions
            ├── components/
            ├── reducers/
            └── store.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Stripe / Razorpay account (for payments)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/eccomerce.git
cd eccomerce/Ecommerce-Website
```

### 2. Set up environment variables

Create `backend/config/config.env`:

```env
PORT=8000
NODE_ENV=development

MONGO_URI=your_mongodb_atlas_uri

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=VIPcart

STRIPE_API_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Install dependencies & run

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Run backend (from Ecommerce-Website/)
npm run dev

# Run frontend (from Ecommerce-Website/frontend/)
npm start
```

The backend runs on `http://localhost:8000` and the frontend proxies to it automatically.

---

## 📡 API Reference

Full Postman collection:
[View Postman Collection](https://dhushyandhneduncheziyan4896-4818548.postman.co/workspace/Dhushyandh-N's-Workspace~d5d0ebab-b4b4-4a22-82a5-ac71609250fb/collection/50814312-e8226717-08c2-421e-b6d0-61fc3f635a14?action=share&source=copy-link&creator=50814312)

Includes:
- Authentication (Register / Login / Logout)
- Product CRUD
- Cart & Order management
- Reviews & Ratings
- Admin-specific endpoints

---

## 📌 Project Status

| Feature | Status |
|---|---|
| Core features | Complete |
| Payment integration | Complete |
| Admin dashboard | Complete |
| Mobile responsiveness | In progress |

---

## 🎯 Purpose

Built to gain hands-on experience with:
- Full-stack MERN development
- Real-world auth flows (JWT + OAuth)
- Payment gateway integration
- Cloud media management
- Production deployment on Render

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
