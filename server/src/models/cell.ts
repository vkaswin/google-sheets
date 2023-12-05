import { Schema, model } from "mongoose";

const CellSchema = new Schema(
  {
    gridId: {
      required: true,
      index: true,
      type: Schema.Types.ObjectId,
    },
    rowId: {
      required: true,
      type: Number,
    },
    columnId: {
      required: true,
      type: Number,
    },
    background: {
      default: "#ffffff",
      type: String,
    },
    textAlign: {
      default: "left",
      type: String,
    },
    text: {
      default: "",
      type: String,
    },
    content: {
      default: [],
      type: Array,
    },
  },
  { timestamps: true }
);

const Cell = model("Cell", CellSchema);

export default Cell;
