const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const childRoutes = require("./routes/childRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "BalSetu Backend is running!"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/children", childRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`BalSetu server running on http://localhost:${PORT}`);
});