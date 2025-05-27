const User = require("../model/userModel")
const bcrypte = require("bcrypt")

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" }); // Use .status
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: "Email already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // typo fixed here too

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            },
            message: "User registered successfully"
        });

    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};