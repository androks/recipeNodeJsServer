import mongoose, {model, Model, Schema} from "mongoose";
import {Recipe} from "../Recipe";

const RecipeSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    actualVersion: { type: Schema.Types.ObjectId, ref: 'RecipeVersion' }
});

export const RecipeDoc: Model<Recipe> = model<Recipe>("User", RecipeSchema);
