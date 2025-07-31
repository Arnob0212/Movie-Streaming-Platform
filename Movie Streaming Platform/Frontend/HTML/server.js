const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const newsletterDB = mongoose.createConnection("mongodb://127.0.0.1:27017/newsletterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

newsletterDB.on("connected", () => console.log("Connected to newsletterDB"));
newsletterDB.on("disconnected", () => console.log("Disconnected from newsletterDB"));
newsletterDB.on("error", (err) => console.log("newsletterDB Connection Error:", err));

const userDB = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

userDB.on("connected", () => console.log("Connected to userDB"));
userDB.on("disconnected", () => console.log("Disconnected from userDB"));
userDB.on("error", (err) => console.log("userDB Connection Error:", err));


//movie
const movieDB = mongoose.createConnection("mongodb://127.0.0.1:27017/movieDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
movieDB.on("connected", () => console.log("Connected to movieDB"));
movieDB.on("error", (err) => console.log("movieDB Connection Error:", err));



//newsletter
const emailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
});
const Email = newsletterDB.model("Email", emailSchema);

//user 
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = userDB.model("User", userSchema);
//movie
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: String, required: true }, 
    trailer: { type: String, required: true }, 
    movie: { type: String, required: true } 
});
const Movie = movieDB.model("Movie", movieSchema);

//newslater apis
app.post("/subscribe", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const existingEmail = await Email.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already subscribed" });

        const newEmail = new Email({ email });
        await newEmail.save();
        res.json({ message: "Successfully subscribed!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
//profile api
app.get("/profile", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.email) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const user = await User.findOne({ email: decoded.email }, { password: 0 }); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ success: true, email: user.email });

    } catch (error) {
        console.error("Profile Fetch Error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// user api
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email & Password required" });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "You are already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: " Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login Attempt for:", email); 

        if (!email || !password) {
            console.log("Missing email/password");
            return res.status(400).json({ message: "Email & password required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User Not Found:", email);
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect Password for:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Login Successful for:", email);

        res.json({ success: true, token, email: user.email });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

//it
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    jwt.verify(token, "your_jwt_secret", (err, user) => {
        if (err) return res.status(403).json({ message: "Forbidden: Invalid token" });

        req.user = user;
        next();
    });
}
app.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: "Search query is required" });

        const movies = await Movie.find({ title: { $regex: query, $options: "i" } });
        res.json(movies);
    } catch (error) {
        console.error("Search Error:", error.message);
        res.status(500).json({ message: " Server error" });
    }
});
//starting the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
