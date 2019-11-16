import {model, Model, Schema} from "mongoose";
import {Recipe} from "../Recipe";

const RecipeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    actualVersion: { type: Schema.Types.ObjectId, ref: 'RecipeVersion' }
});

export const RecipeDoc: Model<Recipe> = model<Recipe>("User", RecipeSchema);
