import { Schema, model } from "mongoose";
import { generateRandomColor } from "../utils";

const UserSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    colorCode: {
      type: String,
      default: generateRandomColor,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);

export default User;
