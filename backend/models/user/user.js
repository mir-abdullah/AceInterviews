import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true,
      lowercase: true,
    trim: true,

    },
    password: {
      type: String,
      required: true,
    },
    verificationToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dft2urwa8/image/upload/v1722854687/profile-circle-icon-256x256-cm91gqm2_yi3mhf.png",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
