import express from "express";
import multer from "multer";
import { execute } from "../controller/excute.js";
import { uploadController } from "../controller/uploadFile.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/', storage: multer.memoryStorage({}) })
/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
/*-------------------------------------------------------------------------*/

router.post('/execute', execute.excuteSelenium)
router.post('/uploadFile', upload.single('files'), uploadController.uploadExcel)

export default router;
