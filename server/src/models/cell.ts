import { Schema, model } from "mongoose";

const CellSchema = new Schema(
  {
    rowId: {
      required: true,
      type: Number,
    },
    columnId: {
      required: true,
      type: Number,
    },
    backgroundColor: {
      default: "#FFFFFF",
      type: String,
    },
    color: {
      default: "#000000",
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

export default model("Cell", CellSchema);
