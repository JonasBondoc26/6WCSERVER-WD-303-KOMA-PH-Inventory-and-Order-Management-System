# KOMA PH — Order Management System

**Keep On Moving Ahead.** An online store and order management system for **KOMA PH**, a Filipino streetwear brand from Pampanga, built with the **MEVN** stack (MongoDB, Express, Vue, Node.js).

🌐 **Live site:** [koma-ph.netlify.app](https://koma-ph.netlify.app)

## About the Project

The rationale of creating this system is that it will assist KOMA PH in shifting to less manual work and a more coordinated, effective, and factual system. The implementation of such a system will allow the business to streamline operations, minimize human mistakes, increase customer satisfaction, and provide a stable basis on which the expansion will take place in the future. Another objective of the project is to show how web technologies can be used in addressing real-life management issues of business.

## Features

**Shopping**
- Browse the **V1** and **Drift** collections
- Add items to a cart, change quantities, and remove items from a slide-out cart panel
- Save favorite items to a wishlist
- Checkout with shipping details and a choice of Cash on Delivery, GCash, or Bank Transfer

**Accounts**
- Sign up and sign in (with a username or email); passwords are hashed with bcrypt
- Profile dashboard with order count, wishlist count, and total spent
- Edit profile information and change password
- Order history with item, shipping, and payment details for each order

**Design**
- Responsive layout for phones, tablets, and desktops, with a mobile menu
- Pages: Home, About, Shop, Product, Feature, Sign In / Sign Up, Profile, My Orders, Wishlist, Checkout

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | Vue 3, Vue Router, Vite |
| Backend  | Node.js, Express 5 |
| Database | MongoDB Atlas with Mongoose |
| Security | bcryptjs (password hashing), CORS |
| Hosting  | Netlify (frontend), Render (backend) |

## Project Structure

```
KOMA Vue/
├── backend/
│   └── server.js            # Express API + MongoDB models
├── public/                  # favicon, Netlify _redirects
├── src/
│   ├── assets/
│   │   ├── css/             # base.css (design system) + one stylesheet per page
│   │   ├── js/
│   │   │   ├── script.js    # cart, wishlist, orders, and user helpers
│   │   │   └── store.js     # shared login state and notifications
│   │   └── photos/
│   ├── components/
│   │   ├── layout/          # header, footer, cart drawer, account layout, toasts
│   │   └── *.vue            # one component per page
│   ├── router/index.js
│   ├── App.vue
│   └── main.js
├── index.html
└── package.json
```

## Getting Started

### Requirements
- [Node.js](https://nodejs.org/) 20 or newer
- A MongoDB database: a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or a local one through MongoDB Compass

### 1. Install dependencies

Open the project folder in VS Code, open a terminal, and run:

```bash
npm install
```

### 2. Create the environment files

These files are not in the repository because they contain private settings. Create them yourself:

**`backend/.env`** — your database connection:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/koma_db?retryWrites=true&w=majority
```
For a local database, use `MONGO_URI=mongodb://127.0.0.1:27017/koma_db` instead.

**`.env`** (project root) — the backend address used by the deployed website:
```env
VITE_API_URL=https://komaph-backend.onrender.com
```

`.env.development` is already included. It points the website to `http://localhost:5000` while you run `npm run dev`.

### 3. Start the backend

Open a terminal in VS Code and run:

```bash
cd backend
node server.js
```

You should see `🚀 Server running on port 5000` and `✅ Connected to MongoDB Atlas`.

### 4. Start the website

Open a **second** terminal and run:

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173). The database `koma_db` and the `users` collection are created automatically the first time someone signs up.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/signup` | Create an account |
| POST   | `/login` | Sign in with username or email |
| PUT    | `/users/:id` | Update profile information |
| GET    | `/users/:id/cart` | Get the cart |
| POST   | `/users/:id/cart` | Add an item to the cart |
| PUT    | `/users/:id/cart/:cartId` | Change an item's quantity |
| DELETE | `/users/:id/cart/:cartId` | Remove an item from the cart |
| DELETE | `/users/:id/cart` | Empty the cart |
| GET    | `/users/:id/wishlist` | Get the wishlist |
| POST   | `/users/:id/wishlist` | Add an item to the wishlist |
| DELETE | `/users/:id/wishlist/:productId` | Remove an item from the wishlist |
| GET    | `/users/:id/orders` | Get order history |
| POST   | `/users/:id/orders` | Place an order (also empties the cart) |

## Deployment

**Backend (Render):** set `MONGO_URI` in the service's **Environment** settings. `CLIENT_URL` is optional and defaults to `https://koma-ph.netlify.app`; to allow several sites, separate them with commas. In MongoDB Atlas, go to **Network Access** and allow `0.0.0.0/0` so Render can connect.

**Frontend (Netlify):** build command `npm run build`, publish directory `dist`. The `_redirects` file makes page refreshes work on routes like `/shop`.

> **Note:** Free MongoDB Atlas clusters pause after a period of inactivity. If sign-in starts timing out, open Atlas and make sure the cluster is running.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Can't reach the server" when signing in | Make sure the backend is running (`node server.js`) and shows *Connected to MongoDB Atlas*. |
| Backend says `querySrv ENOTFOUND` | The Atlas cluster is paused or the `MONGO_URI` address is wrong. |
| Backend times out on every request | Allow your IP (or `0.0.0.0/0`) in Atlas **Network Access**. |
| "User not found" | Create an account on the Sign Up page first. |

---

© KOMA PH. Made with pride in Pampanga.
