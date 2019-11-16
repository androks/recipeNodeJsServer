import {PORT} from "./constants/Constants";
import app from "./app";

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));