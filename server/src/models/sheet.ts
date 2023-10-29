import { Schema, model } from "mongoose";

const SheetSchema = new Schema({}, { timestamps: true });

export default model("Sheet", SheetSchema);
