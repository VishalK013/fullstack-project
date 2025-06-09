const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "Viking001";


exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: "All fields are required!" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ success: false, error: "Email already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    await newUser.save();

    return res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, error: "Server error", details: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ success: false, error: "Server error", details: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ success: false, error: "Email and Password are required" });
  }

  try {
    const user = await User.findOne({ email });// we are using email to find the user cause it's unique

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);//M athcing password

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token,
      message: "Login Successful"
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: "Server error", details: error.message });
  }
};
