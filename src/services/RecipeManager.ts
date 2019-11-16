import {Recipe} from "../models/Recipe";
import {RecipeDoc} from "../models/db/RecipeSchema";
import {RecipeVersion} from "../models/RecipeVersion";
import {RecipeVersionDoc} from "../models/db/RecipeVersionSchema";
import mongoose from "mongoose";
import {BadRequestException, NotFoundException} from "./Exceptions";
import {RecipeResponse} from "../models/response/RecipeResponse";

export class RecipeManager {

    public static async getLatestRecipes(): Promise<RecipeResponse[]> {
        let items: Recipe[] = await RecipeDoc.find().select('actualVersion');
        let ids = items.map(item => item.actualVersion);
        let result: RecipeVersion[] = await RecipeVersionDoc.find({'_id': {$in: ids}});
        return RecipeManager.mapAllLatestRecipesToResponse(result)
    }

    public static async saveNewRecipe(description: string | null): Promise<void> {
        if (description === null || description.length === 0) {
            throw new BadRequestException("Provide description")
        }

        const newRecipeId = new mongoose.Types.ObjectId();
        const newRecipeVersionId = new mongoose.Types.ObjectId();

        await new RecipeDoc({
            _id: newRecipeId,
            actualVersion: newRecipeVersionId
        }).save();
        await new RecipeVersionDoc({
            _id: newRecipeVersionId,
            recipeId: newRecipeId,
            description: description
        }).save();
    }

    public static async saveNewRecipeVersion(recipeId: string | null, newDescription: string | null): Promise<void> {
        if (recipeId === null || recipeId.length === 0) {
            throw new BadRequestException("Provide recipe id")
        }
        if (newDescription === null || newDescription.length === 0) {
            throw new BadRequestException("Provide new description")
        }

        const newRecipeVersionId = new mongoose.Types.ObjectId();

        try {
            await RecipeDoc.updateOne({_id: recipeId}, {actualVersion: newRecipeVersionId});
        } catch (e) {
            throw new NotFoundException("No such recipe id")
        }
        await new RecipeVersionDoc({
            _id: newRecipeVersionId,
            recipeId: recipeId,
            description: newDescription
        }).save();
    }

    public static async getAllVersionsOfRecipe(recipeId: string | null): Promise<RecipeResponse[]> {
        if (recipeId === null || recipeId.length === 0) {
            throw new BadRequestException("Provide recipe id")
        }

        try {
            let recipeVersions: RecipeVersion[] = await RecipeVersionDoc.find({recipeId: recipeId});
            return RecipeManager.mapAllVersionsOfRecipeToResponse(recipeVersions);
        } catch (e) {
            throw new NotFoundException("No such recipe id")
        }
    }

    public static async clear() {
        await RecipeDoc.deleteMany({});
        await RecipeVersionDoc.deleteMany({});
    }

    private static mapAllLatestRecipesToResponse(items: RecipeVersion[]): RecipeResponse[] {
        return items.map(item => {
            let recipe: RecipeResponse = {
                id: item.recipeId,
                description: item.description,
                dateCreated: item.dateCreated
            };
            return recipe
        })
    }

    private static mapAllVersionsOfRecipeToResponse(items: RecipeVersion[]): RecipeResponse[] {
        return items.map(item => {
            let recipe: RecipeResponse = {
                id: item._id,
                description: item.description,
                dateCreated: item.dateCreated
            };
            return recipe
        })
    }
}
