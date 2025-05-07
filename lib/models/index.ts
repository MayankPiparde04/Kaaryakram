import { createModel } from "./modelFactory";
import {
  userSchema,
  productSchema,
  orderSchema,
  panditSchema,
  darkStoreSchema,
  deliveryPartnerSchema,
  bundleSchema,
  reviewSchema,
  bookingSchema,
  chatbotSchema,
  addressSchema,
  verificationSchema,
  cartSchema,
  poojaSchema,
  emailNotificationSchema
} from "../schemas";

// Models creation (will only be executed once in a serverless environment)
export const User = createModel("User", userSchema);
export const Product = createModel("Product", productSchema);
export const Order = createModel("Order", orderSchema);
export const Pandit = createModel("Pandit", panditSchema);
export const DarkStore = createModel("DarkStore", darkStoreSchema);
export const DeliveryPartner = createModel("DeliveryPartner", deliveryPartnerSchema);
export const Bundle = createModel("Bundle", bundleSchema);
export const Review = createModel("Review", reviewSchema);
export const Booking = createModel("Booking", bookingSchema);
export const Chatbot = createModel("Chatbot", chatbotSchema);
export const Address = createModel("Address", addressSchema);
export const Verification = createModel("Verification", verificationSchema);
export const Cart = createModel("Cart", cartSchema);
export const Pooja = createModel("Pooja", poojaSchema);
export const EmailNotification = createModel("EmailNotification", emailNotificationSchema);

// Re-export all models
export const models = {
  User,
  Product,
  Order,
  Pandit,
  DarkStore,
  DeliveryPartner,
  Bundle,
  Review,
  Booking,
  Chatbot,
  Address,
  Verification,
  Cart,
  Pooja,
  EmailNotification,
};
