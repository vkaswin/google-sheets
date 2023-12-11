import { Schema, model, Types } from "mongoose";

const SheetSchema = new Schema(
  {
    title: {
      default: "Untitled Spreadsheet",
      type: String,
    },
    grids: {
      ref: "Grid",
      type: [Types.ObjectId],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastOpenedAt: {
      type: Date,
      default: () => new Date().toISOString(),
    },
  },
  { timestamps: true }
);

const Sheet = model("Sheet", SheetSchema);

export default Sheet;
