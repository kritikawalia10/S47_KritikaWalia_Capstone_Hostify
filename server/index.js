const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// ─── Local Fallback State ────────────────────────────────────────────────────
let useLocalFallback = false;
let usersDb = [];
let hostelsDb = [];
let bookingsDb = [];

const generateId = () => Math.random().toString(36).substring(2, 11);

// ─── Models ──────────────────────────────────────────────────────────────────
const User = require('./models/User');
const Hostel = require('./models/Hostel');
const Booking = require('./models/Booking');

// ─── MongoDB Connection ──────────────────────────────────────────────────────
console.log('🔌 Connecting to MongoDB...');

mongoose.connect(process.env.URL)
  .then(async () => {
    console.log('✅ MongoDB Atlas connected successfully');
    await seedData();
  })
  .catch(async (err) => {
    console.log('⚠️  MongoDB Atlas unavailable — starting with local in-memory database');
    console.log('   (To connect to Atlas, check your network and the URL in .env)');
    useLocalFallback = true;
    await seedLocalFallbackData();
  });

// ─── Seed MongoDB ─────────────────────────────────────────────────────────────
const seedData = async () => {
  const count = await Hostel.countDocuments();
  if (count > 0) return;

  console.log('📦 Seeding initial data to MongoDB...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  let owner = await User.findOne({ email: 'owner@hostify.com' });
  if (!owner) {
    owner = await new User({ name: 'Kritika (Host)', email: 'owner@hostify.com', password: hashedPassword, role: 'owner' }).save();
  }

  await Hostel.insertMany([
    { hostelName: 'Green Heights Girls PG', roomsAvail: 10, roomType: 'Single AC & Non-AC', price: 12000, imgUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600', ownerId: owner._id },
    { hostelName: 'Blue Horizon Boys PG',  roomsAvail: 14, roomType: 'Double AC',          price: 15000, imgUrl: 'https://images.unsplash.com/photo-1596276122653-651a3898309f?auto=format&fit=crop&q=80&w=600', ownerId: owner._id },
    { hostelName: 'Silver Pine PG',         roomsAvail: 17, roomType: 'Single Non-AC',      price: 10000, imgUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=600', ownerId: owner._id },
    { hostelName: 'Apex Elite Residence',   roomsAvail: 21, roomType: 'Suite AC',           price: 18000, imgUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600', ownerId: owner._id },
  ]);
  console.log('✅ Seeding complete');
};

// ─── Seed Local Fallback ─────────────────────────────────────────────────────
const seedLocalFallbackData = async () => {
  const salt = await bcrypt.genSalt(10);

  const ownerPassword = await bcrypt.hash('password123', salt);
  const guestPassword = await bcrypt.hash('password123', salt);

  usersDb = [
    { _id: 'owner_1', name: 'Kritika (Host)', email: 'owner@hostify.com', password: ownerPassword, role: 'owner' },
    { _id: 'guest_1', name: 'Guest Tester',   email: 'user@hostify.com',  password: guestPassword, role: 'user'  },
  ];

  hostelsDb = [
    { _id: 'h1', hostelName: 'Green Heights Girls PG', roomsAvail: 10, roomType: 'Single AC & Non-AC', price: 12000, imgUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600', ownerId: 'owner_1' },
    { _id: 'h2', hostelName: 'Blue Horizon Boys PG',   roomsAvail: 14, roomType: 'Double AC',           price: 15000, imgUrl: 'https://images.unsplash.com/photo-1596276122653-651a3898309f?auto=format&fit=crop&q=80&w=600', ownerId: 'owner_1' },
    { _id: 'h3', hostelName: 'Silver Pine PG',          roomsAvail: 17, roomType: 'Single Non-AC',       price: 10000, imgUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=600', ownerId: 'owner_1' },
    { _id: 'h4', hostelName: 'Apex Elite Residence',    roomsAvail: 21, roomType: 'Suite AC',            price: 18000, imgUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600', ownerId: 'owner_1' },
  ];

  console.log('✅ Local database ready');
  console.log('   Host  → owner@hostify.com / password123');
  console.log('   Guest → user@hostify.com  / password123');
};

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (useLocalFallback) {
      if (usersDb.find(u => u.email === email))
        return res.status(400).json({ message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      usersDb.push({ _id: generateId(), name: name || '', email, password: await bcrypt.hash(password, salt), role: role || 'user' });
      return res.status(201).json({ message: 'Registered successfully' });
    }

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    await new User({ name: name || '', email, password: await bcrypt.hash(password, salt), role: role || 'user' }).save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = useLocalFallback
      ? usersDb.find(u => u.email === email)
      : await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// HOSTEL ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET all hostels (public)
app.get('/api/hostels', async (req, res) => {
  try {
    if (useLocalFallback) {
      return res.json(hostelsDb.map(h => ({
        ...h,
        ownerId: usersDb.find(u => u._id === h.ownerId) || { name: 'Unknown', email: '' }
      })));
    }
    res.json(await Hostel.find({}).populate('ownerId', 'name email'));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET owner's own listings (host only)
app.get('/api/hostels/my-listings', auth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Hosts only' });
  try {
    if (useLocalFallback) return res.json(hostelsDb.filter(h => h.ownerId === req.user.userId));
    res.json(await Hostel.find({ ownerId: req.user.userId }));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single hostel by id
app.get('/api/hostels/:id', async (req, res) => {
  try {
    if (useLocalFallback) {
      const h = hostelsDb.find(h => h._id === req.params.id);
      return h ? res.json(h) : res.status(404).json({ message: 'Not found' });
    }
    const h = await Hostel.findById(req.params.id);
    h ? res.json(h) : res.status(404).json({ message: 'Not found' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create hostel (host only)
app.post('/api/hostels', auth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Hosts only' });
  const { hostelName, roomsAvail, roomType, price, imgUrl } = req.body;
  const defaultImg = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600';
  try {
    if (useLocalFallback) {
      const h = { _id: generateId(), hostelName, roomsAvail: Number(roomsAvail), roomType, price: Number(price), imgUrl: imgUrl || defaultImg, ownerId: req.user.userId };
      hostelsDb.push(h);
      return res.status(201).json({ message: 'Hostel created', hostel: h });
    }
    const h = await new Hostel({ hostelName, roomsAvail, roomType, price, imgUrl: imgUrl || defaultImg, ownerId: req.user.userId }).save();
    res.status(201).json({ message: 'Hostel created', hostel: h });
  } catch (err) {
    console.error('Create hostel error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update hostel (host only, must own it)
app.put('/api/hostels/:id', auth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Hosts only' });
  try {
    if (useLocalFallback) {
      const h = hostelsDb.find(h => h._id === req.params.id);
      if (!h) return res.status(404).json({ message: 'Not found' });
      if (h.ownerId !== req.user.userId) return res.status(403).json({ message: 'Unauthorized' });
      Object.assign(h, { hostelName: req.body.hostelName || h.hostelName, roomsAvail: req.body.roomsAvail !== undefined ? Number(req.body.roomsAvail) : h.roomsAvail, roomType: req.body.roomType || h.roomType, price: req.body.price ? Number(req.body.price) : h.price, imgUrl: req.body.imgUrl || h.imgUrl });
      return res.json({ message: 'Hostel updated', hostel: h });
    }
    const h = await Hostel.findById(req.params.id);
    if (!h) return res.status(404).json({ message: 'Not found' });
    if (h.ownerId.toString() !== req.user.userId) return res.status(403).json({ message: 'Unauthorized' });
    const { hostelName, roomsAvail, roomType, price, imgUrl } = req.body;
    if (hostelName) h.hostelName = hostelName;
    if (roomsAvail !== undefined) h.roomsAvail = roomsAvail;
    if (roomType) h.roomType = roomType;
    if (price) h.price = price;
    if (imgUrl) h.imgUrl = imgUrl;
    await h.save();
    res.json({ message: 'Hostel updated', hostel: h });
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE hostel (host only, must own it)
app.delete('/api/hostels/:id', auth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Hosts only' });
  try {
    if (useLocalFallback) {
      const idx = hostelsDb.findIndex(h => h._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Not found' });
      if (hostelsDb[idx].ownerId !== req.user.userId) return res.status(403).json({ message: 'Unauthorized' });
      hostelsDb.splice(idx, 1);
      bookingsDb = bookingsDb.filter(b => b.hostelId !== req.params.id);
      return res.json({ message: 'Hostel deleted' });
    }
    const h = await Hostel.findById(req.params.id);
    if (!h) return res.status(404).json({ message: 'Not found' });
    if (h.ownerId.toString() !== req.user.userId) return res.status(403).json({ message: 'Unauthorized' });
    await Hostel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hostel deleted' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// POST book a hostel (guest only)
app.post('/api/bookings', auth, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ message: 'Guests only' });
  const { hostelId } = req.body;
  try {
    if (useLocalFallback) {
      const h = hostelsDb.find(h => h._id === hostelId);
      if (!h) return res.status(404).json({ message: 'Hostel not found' });
      if (h.roomsAvail <= 0) return res.status(400).json({ message: 'No rooms available' });
      const b = { _id: generateId(), hostelId, userId: req.user.userId, status: 'Pending', createdAt: new Date().toISOString() };
      bookingsDb.push(b);
      return res.status(201).json({ message: 'Booking requested successfully', booking: b });
    }
    const h = await Hostel.findById(hostelId);
    if (!h) return res.status(404).json({ message: 'Hostel not found' });
    if (h.roomsAvail <= 0) return res.status(400).json({ message: 'No rooms available' });
    const b = await new Booking({ hostelId, userId: req.user.userId }).save();
    res.status(201).json({ message: 'Booking requested successfully', booking: b });
  } catch (err) {
    console.error('Booking error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET guest's own bookings
app.get('/api/bookings/my-bookings', auth, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ message: 'Guests only' });
  try {
    if (useLocalFallback) {
      return res.json(bookingsDb.filter(b => b.userId === req.user.userId).map(b => ({ ...b, hostelId: hostelsDb.find(h => h._id === b.hostelId) })));
    }
    res.json(await Booking.find({ userId: req.user.userId }).populate('hostelId'));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all bookings on host's own properties
app.get('/api/bookings/owner-bookings', auth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Hosts only' });
  try {
    if (useLocalFallback) {
      const myIds = hostelsDb.filter(h => h.ownerId === req.user.userId).map(h => h._id);
      return res.json(bookingsDb.filter(b => myIds.includes(b.hostelId)).map(b => {
        const guest = usersDb.find(u => u._id === b.userId) || {};
        return { ...b, hostelId: hostelsDb.find(h => h._id === b.hostelId), userId: { _id: guest._id, name: guest.name, email: guest.email } };
      }));
    }
    const myHostels = await Hostel.find({ ownerId: req.user.userId });
    const ids = myHostels.map(h => h._id);
    res.json(await Booking.find({ hostelId: { $in: ids } }).populate('hostelId').populate('userId', 'name email'));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT accept or reject a booking (host only)
app.put('/api/bookings/:id', auth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Hosts only' });
  const { status } = req.body;
  if (!['Confirmed', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  try {
    if (useLocalFallback) {
      const b = bookingsDb.find(b => b._id === req.params.id);
      if (!b) return res.status(404).json({ message: 'Booking not found' });
      const h = hostelsDb.find(h => h._id === b.hostelId);
      if (!h || h.ownerId !== req.user.userId) return res.status(403).json({ message: 'Unauthorized' });
      b.status = status;
      if (status === 'Confirmed' && h.roomsAvail > 0) h.roomsAvail -= 1;
      return res.json({ message: `Booking ${status.toLowerCase()}`, booking: b });
    }
    const b = await Booking.findById(req.params.id).populate('hostelId');
    if (!b) return res.status(404).json({ message: 'Booking not found' });
    if (b.hostelId.ownerId.toString() !== req.user.userId) return res.status(403).json({ message: 'Unauthorized' });
    b.status = status;
    await b.save();
    if (status === 'Confirmed') {
      const h = await Hostel.findById(b.hostelId._id);
      if (h.roomsAvail > 0) { h.roomsAvail -= 1; await h.save(); }
    }
    res.json({ message: `Booking ${status.toLowerCase()}`, booking: b });
  } catch (err) {
    console.error('Update booking error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// AI RECOMMENDATION ROUTE
// ─────────────────────────────────────────────────────────────────────────────

app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  try {
    const list = useLocalFallback ? hostelsDb : await Hostel.find({});
    const apiKey = process.env.GEMINI_API_KEY;

    // Graceful fallback if API key not configured
    if (!apiKey || apiKey.trim() === '') {
      const featured = list.slice(0, 3);
      return res.json({
        reply: `Hi! I'm your Hostify AI Assistant 🏠\n\nHere are some featured stays from our current listings:\n\n${featured.map(h => `• **${h.hostelName}** — ₹${h.price}/month (${h.roomType}) — ${h.roomsAvail} rooms available`).join('\n')}\n\n💡 *Pro Tip: Add your Gemini API key to \`.env\` (GEMINI_API_KEY) to unlock full AI-powered recommendations!*`
      });
    }

    const context = list.map(h => `- ${h.hostelName}: ${h.roomsAvail} rooms available, ${h.roomType}, ₹${h.price}/month`).join('\n');

    const prompt = `You are "Hostify AI Assistant", a friendly and smart accommodation recommender for a hostel & PG booking platform in India.

Available listings in our database:
${context}

User query: "${message}"

Instructions:
- Recommend ONLY from the listings provided above
- If the user mentions a budget, suggest options at or below that amount
- If they mention AC/Non-AC or room type, filter accordingly
- Keep response short (2–4 sentences), warm and helpful
- Use **bold** for hostel names and show prices in ₹
- Do NOT invent hostels that aren't in the list`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Sorry, I could not generate a recommendation right now. Please try again!';

    res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err.message);
    res.status(500).json({ message: 'AI assistant is temporarily unavailable', error: err.message });
  }
});

// ─── Root Route (Health Check) ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🏠 Hostify API is running!',
    version: '1.0.0',
    status: 'OK',
    database: useLocalFallback ? 'Local In-Memory (Fallback)' : 'MongoDB Atlas',
    note: 'The React frontend runs on http://localhost:5173',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login'],
      hostels: ['GET /api/hostels', 'POST /api/hostels', 'PUT /api/hostels/:id', 'DELETE /api/hostels/:id'],
      bookings: ['POST /api/bookings', 'GET /api/bookings/my-bookings', 'GET /api/bookings/owner-bookings', 'PUT /api/bookings/:id'],
      ai: ['POST /api/ai/chat']
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {

  console.log(`🚀 Hostify server running at http://localhost:${PORT}`);
});
