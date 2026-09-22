import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    address_line: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
    },
    country: {
      type: String,
    },

    mobile: {               // ✅ monile -> mobile
      type: Number,
      default: null,
    },

    userId: {               // ✅ Missing field
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;