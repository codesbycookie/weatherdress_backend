const mongoose = require("mongoose");

const DressSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Example: Denim Jacket, Cotton T-Shirt
  
  fabric_type: { 
    type: String, 
    required: true,
    enum: ["Cotton", "Polyester", "Wool", "Denim", "Silk", "Linen", "Rayon", "Leather", "Nylon"]
  },

  fit_type: { 
    type: String, 
    required: true,
    enum: ["Slim Fit", "Regular Fit", "Oversized", "Loose Fit", "Tapered Fit", "Relaxed Fit"]
  }, 

  image: {
    url: { type: String, required: true },
    filename: { type: String, required: true}
  }, // URL for the dress image
  
  createdAt: { type: Date, default: Date.now }
});

const Dress = mongoose.model("Dress", DressSchema);

module.exports = Dress
