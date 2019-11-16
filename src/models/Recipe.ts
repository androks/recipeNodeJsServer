import { Document} from "mongoose";

export interface Recipe extends Document {
    id: string;
    actualVersion: string;
}
