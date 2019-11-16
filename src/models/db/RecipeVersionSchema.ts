import mongoose, {model, Model, Schema} from "mongoose";
import {Recipe} from "../Recipe";
import {RecipeVersion} from "../RecipeVersion";

export const RecipeVersionSchema = new Schema({
    recipeId: {type: Schema.Types.ObjectId, ref: 'Recipe'},
    description: String,
    dateCreated: {type: Date, default: Date.now}
});

export const RecipeVersionDoc: Model<RecipeVersion> = model<RecipeVersion>("RecipeVersion", RecipeVersionSchema);
