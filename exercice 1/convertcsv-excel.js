import path from "path"
import { dirname } from "path/win32";
const {convertCsvToXlsx} = require('@aternus/csv-to-xlsx');

let csvPath=path.join(__dirname,"./database.csv")
let excelPath=path.join(__dirname,"./database.xlsx")

/*export*/ function convert() {

try {
  convertCsvToXlsx(csvPath, excelPath);
} catch (e) {
  console.error(e.toString());
}

}
// to convert it type <npx @aternus/csv-to-xlsx -i "database.csv" -o "datase.xlsx"> on terminal