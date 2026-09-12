const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Temporary in-memory placeholder — we'll replace this with Prisma once DB is connected
const users = [];

const JWT_SECRET = process.env.JWT_SECRET || "temporary_secret_change_this";

// REGISTER
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required." });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      role,
    };

    users.push(newUser);

    res.status(201).json({ message: "User registered successfully", userId: newUser.id });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

module.exports = { register, login };