import {Document} from "mongoose";

export interface RecipeVersion extends Document {
    id: string;
    recipeId: string;
    description: string;
    dateCreated: Date;
}
