import {Application} from 'express';
import {ReceiptService} from "./services/ReceiptService";

export class Controller {
    private receiptService: ReceiptService;

    constructor(private app: Application) {
        this.receiptService = new ReceiptService();
        this.routes();
    }

    public routes() {
        this.app.route('/').get(this.receiptService.welcomeMessage);

        this.app.route("/recipes").get(this.receiptService.getAllReceipts);

        this.app.route("/recipe").post(this.receiptService.saveNewRecipe);
        this.app.route("/recipe/:id").post(this.receiptService.saveNewRecipeVersion);
        this.app.route("/recipe/:id").get(this.receiptService.getAllVersionsOfRecipe);
        this.app.route("/clear").delete(this.receiptService.clear);
    }
}
