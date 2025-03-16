require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Dress = require("./models/Dress");  // ✅ Import Dress Model
const User = require('./models/User');
const multer = require('multer')
const {checkCloudinaryConnection, storage} = require('./cloudinary/main');

checkCloudinaryConnection();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/weatherdressapp").then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const upload = multer({ storage });


app.post("/user/register", async (req, res) => {

  try {

    const { uid, username, email, bio} = req.body;

    const user = new User({uid: uid, username: username, email: email, bio: bio});

    await user.save();
    res.status(201).json({ message: "User registered successfully", user: user });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ message: "All fields are required" });

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET_KEY", { expiresIn: "1h" });
//     res.json({ token });

//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

app.get("/user/:uid", async (req, res) => {
  try {
    console.log('fetching user details')
    const { uid } = req.params;
    const user = await User.findOne({ uid:uid })
    .populate({
      path: 'wardrobe',
    });

    console.log(user)

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({user: user});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


app.post("/upload-dress",upload.single('image'), async (req, res) => {
  try {
    console.log('uploading dress')
    const { name, fabric_type, fit_type,  uid } = req.body;
    console.log({ name, fabric_type, fit_type,  uid })
    const image = {url: req.file.path, filename: req.file.filename};
    const user = await User.findOne({uid: uid});
    console.log(user)
    const dress = new Dress({ name, fabric_type, fit_type, image });
    await dress.save();
    user.wardrobe.push(dress);
    await user.save();
    res.status(201).json({ message: "Dress added successfully", dress: dress });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
