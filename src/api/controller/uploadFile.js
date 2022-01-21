import { exportReport } from "../service/excel.js";

async function uploadExcel(req, res) {
    try {
        const buffer = req.file.buffer
        let codeClient = await exportReport(buffer);

        return res.status(200).json({ success: true, data: codeClient });
    } catch (e) {
        console.log(e)
    }
}

export const uploadController = {
    uploadExcel
}