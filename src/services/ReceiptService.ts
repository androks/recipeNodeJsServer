import {Request, Response} from "express";
import mongoose from "mongoose";
import {Recipe} from "../models/Recipe";
import {RecipeDoc} from "../models/db/RecipeSchema";
import {RecipeVersionDoc} from "../models/db/RecipeVersionSchema";
import {RecipeVersion} from "../models/RecipeVersion";

export class ReceiptService {
    public welcomeMessage(req: Request, res: Response) {
        return res.status(200).send("Welcome to receipt API");
    }

    public async getAllReceipts(req: Request, res: Response) {
        try {
            let items: Recipe[] = await RecipeDoc.find().select('actualVersion');
            let ids = items.map(item => item.actualVersion);
            let result: RecipeVersion[] = await RecipeVersionDoc.find({'_id': {$in: ids}});
            res.status(200).send(ReceiptService.mapAllLatestRecipesToResponse(result))
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async saveNewRecipe(req: Request, res: Response) {
        try {
            const newRecipeId = new mongoose.Types.ObjectId();
            const newRecipeVersionId = new mongoose.Types.ObjectId();

            await new RecipeDoc({
                _id: newRecipeId,
                actualVersion: newRecipeVersionId
            }).save();
            await new RecipeVersionDoc({
                _id: newRecipeVersionId,
                recipeId: newRecipeId,
                description: req.body.description
            }).save();

            res.send()
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async saveNewRecipeVersion(req: Request, res: Response) {
        try {
            const recipeId = req.params.id;
            const newRecipeVersionId = new mongoose.Types.ObjectId();

            await RecipeDoc.updateOne({_id: recipeId}, {actualVersion: newRecipeVersionId});
            await new RecipeVersionDoc({
                _id: newRecipeVersionId,
                recipeId: recipeId,
                description: req.body.description
            }).save();

            res.send()
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async getAllVersionsOfRecipe(req: Request, res: Response) {
        try {
            const recipeId = req.params.id;
            let dbRes = await RecipeVersionDoc.find({recipeId: recipeId})
            res.send(ReceiptService.mapAllVersionsOfRecipeToResponse(dbRes))
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async getRecipes(req: Request, res: Response) {
        try {
            res.status(200).send(await RecipeDoc.find())
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async getRecipesVersions(req: Request, res: Response) {
        try {
            res.status(200).send(await RecipeVersionDoc.find())
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async clear(req: Request, res: Response) {
        try {
            await RecipeDoc.deleteMany({});
            await RecipeVersionDoc.deleteMany({});
            res.status(200).send()
        } catch (e) {
            res.status(500).send(e)
        }
    }

    private static mapAllLatestRecipesToResponse(items: RecipeVersion[]): RecipeVersion[] {
        return items.map(item => {
            let res = item.toObject();
            res.id = res.recipeId;
            delete res._id;
            delete res.__v;
            delete res.recipeId;
            return res
        })
    }

    private static mapAllVersionsOfRecipeToResponse(items: RecipeVersion[]): RecipeVersion[] {
        return items.map(item => {
            let res = item.toObject();
            res.id = res._id;
            delete res._id;
            delete res.__v;
            delete res.recipeId;
            return res
        })
    }
}
