// const { mappingClinicData } = require('../utils/mappingExcel')
import ExcelJs from 'exceljs'
import { mappingCodeExcel } from '../utils/mapping.js';

export const exportReport = async (buffer) => {
    let wb = new ExcelJs.Workbook();
    let jsonData = [];
    await wb.xlsx.load(buffer)
    let ws = wb.getWorksheet("bill")
    ws.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        let data = mappingCodeExcel(row.values)
        jsonData = [...jsonData, data]
    })
    jsonData = jsonData.filter(n => n)
    return jsonData
}


