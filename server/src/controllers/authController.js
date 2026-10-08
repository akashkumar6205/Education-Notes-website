import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'notes_secret_jwt_key_123',
    { expiresIn: '7d' }
  );
};

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, adminKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Role determination
    let role = 'user';
    if (adminKey) {
      if (adminKey === process.env.ADMIN_SECRET_KEY) {
        role = 'admin';
      } else {
        return res.status(403).json({ message: 'Invalid admin key provided' });
      }
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    });
    await user.save();

    const token = generateToken(user._id, user.email, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user with password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let role = user.role;

    // Check admin key if provided to elevate/verify role
    if (adminKey) {
      if (adminKey === process.env.ADMIN_SECRET_KEY) {
        role = 'admin';
      } else {
        return res.status(403).json({ message: 'Invalid admin key' });
      }
    }

    const token = generateToken(user._id, user.email, role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id || req.user?._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching user' });
  }
};

export default { register, login, getCurrentUser };
