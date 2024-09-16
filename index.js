const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors())


mongoose.connect(process.env.URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


const User = require('./models/User');
app.get('/', async (req, res) => {
  try {
    const collection = await mongoose.connection.collection('info_data');
    const result = await collection.find({}).toArray();
    res.send(result);
    console.log('Result:', result);
  } catch (err) {
    console.error('Error querying MongoDB:', err);
    res.status(500).json({ error: 'Error querying database' });
  }
});

app.post('/addData',(req,res)=>{
  const {name,roomsAvailable,price,roomType} = req.body;
  const data = new User({name,roomsAvailable,price,roomType});
  data.save();
  res.send('Data added successfully');
})

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

 
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
