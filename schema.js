// models/User.js
const mongoose = require('mongoose');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: [{ type: String }],
  role: { type: String, enum: ['user', 'admin', 'delivery_partner', 'darkstore', "Pandits"], default: 'user' },
  isVerified: { type: Boolean, default: false },
  appliedFor: { type: String, enum: ['none', 'delivery_partner', 'darkstore' , "Pandits"], default: 'none' },
  createdAt: { type: Date, default: Date.now },
  refreshToken: { type: String, default: null }  // Store refresh token here (optional)
});

// Method to compare password
UserSchema.statics.comparePasswords = async function (password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;


// models/Verification.js
const VerificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emailToken: String,
  expiresAt: Date,
  verified: { type: Boolean, default: false }
});
module.exports = mongoose.model('Verification', VerificationSchema);

// models/DarkStore.js
const DarkStoreSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('DarkStore', DarkStoreSchema);

// models/DeliveryPartner.js
const DeliveryPartnerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vehicleType: String,
  assignedOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderStatus' }],
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('DeliveryPartner', DeliveryPartnerSchema);

// models/Pandit.js
const PanditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  phone: String,
  experience: Number,
  verified: { type: Boolean, default: false },
  poojasOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pooja' }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Pandit', PanditSchema);

// models/Pooja.js
const PoojaSchema = new mongoose.Schema({
  name: String,
  description: String,
  duration: Number,
  requiredItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Pooja', PoojaSchema);

// models/Product.js
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Product', ProductSchema);

// models/Bundle.js
const BundleSchema = new mongoose.Schema({
  name: String,
  description: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  price: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Bundle', BundleSchema);

// models/Booking.js
const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pandit: { type: mongoose.Schema.Types.ObjectId, ref: 'Pandit' },
  pooja: { type: mongoose.Schema.Types.ObjectId, ref: 'Pooja' },
  date: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Booking', BookingSchema);

// models/History.js
const HistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('History', HistorySchema);

// models/Review.js
const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pandit: { type: mongoose.Schema.Types.ObjectId, ref: 'Pandit' },
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Review', ReviewSchema);

// models/OrderStatus.js
const OrderStatusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('OrderStatus', OrderStatusSchema);

// models/Notification.js
const EmailNotificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the user who will receive the email
  
  email: { 
    type: String, 
    required: true 
  }, // Recipient email address

  subject: { 
    type: String, 
    required: true 
  }, // Email subject

  message: { 
    type: String, 
    required: true 
  }, // The content of the email message
  
  type: { 
    type: String, 
    enum: ['order_receipt', 'verification', 'general'], 
    required: true 
  }, // Type of notification for categorizing emails

  status: { 
    type: String, 
    enum: ['pending', 'sent', 'failed'], 
    default: 'pending' 
  }, // Status of the email sending process
  
  error: { 
    type: String, 
    default: null 
  }, // Stores error messages if sending fails
  
  read: { 
    type: Boolean, 
    default: false 
  }, // Whether the notification has been read by the user
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }, // Timestamp when the notification was created
  
  sentAt: { 
    type: Date, 
    default: null 
  }, // Timestamp when the email was sent (can be null if pending or failed)
  
  deliveredAt: { 
    type: Date, 
    default: null 
  } // Timestamp when the email was successfully delivered (optional)
});


const ChatbotSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  conversationId: { 
    type: String, 
    unique: true, // Ensures uniqueness across users
    required: true 
  }, // Unique conversation ID based on the userId
  messages: [{
    sender: { type: String, enum: ['user', 'chatbot'], required: true }, // Sender of the message (user or chatbot)
    message: { type: String, required: true }, // The message text
    createdAt: { type: Date, default: Date.now } // Timestamp of the message
  }],
  status: { 
    type: String, 
    enum: ['active', 'completed', 'paused'], 
    default: 'active' // Status of the conversation (active, completed, paused)
  },
  lastUpdated: { type: Date, default: Date.now }, // Timestamp of the last update
  createdAt: { type: Date, default: Date.now } // Timestamp when the chat session was created
});

// Pre-save hook to generate conversationId based on userId
ChatbotSchema.pre('save', function(next) {
  // Generate conversationId only if it does not exist
  if (!this.conversationId) {
    const userId = this.user.toString(); // Get userId from the reference
    // Use a hash or direct combination of userId to ensure it's persistent
    this.conversationId = `conversation-${userId}`; // Generate conversationId based on userId
  }
  next();
});

module.exports = mongoose.model('Chatbot', ChatbotSchema);
