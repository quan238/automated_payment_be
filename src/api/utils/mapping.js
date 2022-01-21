
// key mapping in clinic table
const fieldsExcel = [
    "code",
    "name",
    "address",
    "money1",
    "money2",
    "money3",
    "profit",
]


/**
 * Convert 2 array, one with key, and one with value
 * @example
 * zip(['a','b'],['1','2']) ={ a:1, b:2 } 
 */
function zip(arr1, arr2, result = {}) {
    arr1.forEach((key, i) => result[key] = arr2[i]);
    return result;
}

export const mappingCodeExcel = (data) => {
    // 1 field empty skip at first
    data.splice(0, 1)
    const clinic = zip(fieldsExcel, data)
    return clinic.code;
};