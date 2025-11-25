import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["staff", "admin"],
      default: "staff",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// hash the user password before saving to the database
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare the user passwords
userSchema.methods.comparePasswords = async function (candidatePassword) {
  if (!candidatePassword) return false;

  const matchedPassword = await bcrypt.compare(
    candidatePassword,
    this.password
  );
  return matchedPassword;
};

const User = mongoose.model("User", userSchema);

export default User;
