// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/koma_db")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  dob: String,
  address: String,
  contact: String,
  email: String,
  username: String,
  password: String, // will be hashed
  wishlist: [
    {
      productId: String,
      name: String,
      image: String,
      price: Number,
      addedAt: { type: Date, default: Date.now }
    }
  ],
  orders: [
    {
      orderId: String,
      item: String,
      status: String,
      date: { type: Date, default: Date.now },
      meta: mongoose.Schema.Types.Mixed
    }
  ],
  // NEW: cart stored per user
  cart: [
    {
      cartId: { type: String, required: true },
      productId: String,
      name: String,
      image: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, gender, dob, address, contact, email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      gender,
      dob,
      address,
      contact,
      email,
      username,
      password: hashedPassword,
      wishlist: [],
      orders: []
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// 🧩 LOGIN
//
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    // Login successful: return the user object (excluding the password hash)
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ message: "Login successful", user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// Wishlist endpoints
//
app.get("/users/:id/wishlist", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ wishlist: user.wishlist || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users/:id/wishlist", async (req, res) => {
  try {
    const { productId, name, image, price } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent duplicates by productId
    const exists = user.wishlist.some(item => item.productId === productId);
    if (exists) return res.status(400).json({ message: "Item already in wishlist" });

    user.wishlist.push({ productId, name, image, price });
    await user.save();
    res.status(201).json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/users/:id/wishlist/:productId", async (req, res) => {
  try {
    const { id, productId } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(item => item.productId !== productId);
    await user.save();
    res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// Orders endpoints
//
app.get("/users/:id/orders", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "orders");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ orders: user.orders || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users/:id/orders", async (req, res) => {
  try {
    const { orderId, item, status, meta } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.orders.push({ orderId, item, status: status || "Processing", meta });
    await user.save();
    res.status(201).json({ message: "Order added", orders: user.orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// Cart endpoints
//
app.get("/users/:id/cart", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "cart");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ cart: user.cart || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users/:id/cart", async (req, res) => {
  try {
    const { cartId, productId, name, image, price, quantity } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find existing by productId first, fallback to cartId
    let existing = null;
    if (productId) existing = user.cart.find(c => c.productId === productId);
    if (!existing && cartId) existing = user.cart.find(c => c.cartId === cartId);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + (Number(quantity) || 1);
    } else {
      const newCartId = cartId || String(Date.now()) + Math.random().toString(36).slice(2,8);
      user.cart.push({
        cartId: newCartId,
        productId,
        name,
        image,
        price,
        quantity: Number(quantity) || 1
      });
    }

    await user.save();
    res.status(201).json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/users/:id/cart/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = user.cart.find(c => c.cartId === cartId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    if (quantity != null) item.quantity = Number(quantity);
    await user.save();
    res.json({ message: "Cart item updated", cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/users/:id/cart/:cartId", async (req, res) => {
  try {
    const { id, cartId } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(item => item.cartId !== cartId);
    await user.save();
    res.json({ message: "Removed from cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// Update user profile
//
app.put("/users/:id", async (req, res) => {
  try {
    const updates = req.body || {}
    const allowed = ['firstName','lastName','gender','dob','address','contact','email','username','password']
    const keys = Object.keys(updates).filter(k => allowed.includes(k))
    if (!keys.length) return res.status(400).json({ message: "No valid fields to update" })

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    // apply updates
    for (const k of keys) {
      if (k === 'password') {
        // hash new password
        user.password = await bcrypt.hash(String(updates.password), 10)
      } else {
        user[k] = updates[k]
      }
    }

    await user.save()
    const obj = user.toObject()
    delete obj.password
    res.json({ message: "Profile updated", user: obj })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

//
// 🟢 Start Server
//
app.listen(5000, () => console.log("🚀 Server running on port 5000"));