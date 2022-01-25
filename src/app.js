import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

// sưagger
import router from "./api/routes/index.js";
import { corsUrl, port } from "./config.js";
import multer from "multer";


dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(
    bodyParser.urlencoded({
        limit: "10mb",
        extended: true,
        parameterLimit: 50000,
    })
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200, credentials: true, }));

// Routes v1 version
app.use("/v1", router);

app.listen(process.env.PORT || 5000, () =>
    console.log(`
🚀 Docs swagger ready at: http://localhost:${port}`)
);
