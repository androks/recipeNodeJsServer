import {Request, Response} from "express";
import {BadRequestException, NotFoundException} from "./Exceptions";
import {RecipeManager} from "./RecipeManager";

export class ReceiptService {

    public welcomeMessage(req: Request, res: Response) {
        return res.status(200).send("Welcome to receipt API");
    }

    public async getAllReceipts(req: Request, res: Response) {
        try {
            res.send(await RecipeManager.getLatestRecipes())
        } catch (e) {
            ReceiptService.handleException(res, e)
        }
    }

    public async saveNewRecipe(req: Request, res: Response) {
        try {
            res.send(await RecipeManager.saveNewRecipe(req.body.description))
        } catch (e) {
            ReceiptService.handleException(res, e)
        }
    }

    public async saveNewRecipeVersion(req: Request, res: Response) {
        try {
            res.send(await RecipeManager.saveNewRecipeVersion(req.params.id, req.body.description))
        } catch (e) {
            ReceiptService.handleException(res, e)
        }
    }

    public async getAllVersionsOfRecipe(req: Request, res: Response) {
        try {
            res.send(await RecipeManager.getAllVersionsOfRecipe(req.params.id))
        } catch (e) {
            ReceiptService.handleException(res, e)
        }
    }

    public async clear(req: Request, res: Response) {
        try {
            res.send(await RecipeManager.clear())
        } catch (e) {
            ReceiptService.handleException(res, e)
        }
    }

    private static handleException(res: Response, e: Error) {
        switch (e.name) {
            case BadRequestException.NAME:
                res.status(400);
                break;
            case NotFoundException.NAME:
                res.status(404);
                break;
            default:
                res.status(500);
        }
        res.send(this.getErrorBody(e.message))
    }

    private static getErrorBody(message: string): any {
        return {error: message}
    }
}
