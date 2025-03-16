const mongoose = require("mongoose");
const User = require("../models/User");
const Dress = require("../models/Dress");

mongoose
    .connect("mongodb://127.0.0.1:27017/weatherdressapp")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const seedDatabase = async () => {
    try {
        // ✅ Clear existing data
        await User.deleteMany({});
        await Dress.deleteMany({});
        console.log("✅ Existing data cleared");

        // ✅ Create Dresses FIRST
        const dresses = await Dress.insertMany([
            { name: "Casual T-Shirt", fabric_type: "Cotton", fit_type: "Regular Fit", image: {url:  "https://via.placeholder.com/100", filename: 'something'} },
            { name: "Slim Fit Jeans", fabric_type: "Denim", fit_type: "Slim Fit", image: {url:  "https://via.placeholder.com/100", filename: 'something'} },
            { name: "Winter Jacket", fabric_type: "Wool", fit_type: "Relaxed Fit", image: {url:  "https://via.placeholder.com/100", filename: 'something'} },
            { name: "Summer Shorts", fabric_type: "Linen", fit_type: "Loose Fit", image: {url:  "https://via.placeholder.com/100", filename: 'something'} },
            { name: "Formal Shirt", fabric_type: "Silk", fit_type: "Slim Fit", image: {url:  "https://via.placeholder.com/100", filename: 'something'} },
        ]);

        console.log("✅ 5 Dresses Seeded");

        // ✅ Now Create User and Assign Wardrobe
        const user = new User({
            uid: "user123",
            username: "fashionista",
            email: "fashionista@example.com",
            bio: "I love styling and experimenting with new outfits!",
            wardrobe: dresses, // ✅ Assign dresses correctly
        });

        await user.save();
        console.log("✅ User Created with Wardrobe:", user.username);

    } catch (error) {
        console.error("❌ Error Seeding Database:", error);
    } finally {
        await mongoose.connection.close();
        console.log("✅ Database Seeded & Connection Closed");
    }
};

// Run Seed Function
seedDatabase();
