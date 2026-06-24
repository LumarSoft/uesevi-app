const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const fs = require('fs');

const categorias = ["Vigilador General","Vigilador Bombero","Administrativo","Vigilador Principal","Verificador Evento","Operador de monitoreo","Guía Técnico","Instalador de elementos de seguridad electrónica","Controlador de admisión y permanencia en gral."];

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(fs.readFileSync('public/importar-ejemplo.xlsx'));

  const sheet = wb.worksheets[0]; // "Hoja 1"
  // helper hidden sheet
  const listas = wb.addWorksheet("Listas");
  categorias.forEach((n,i)=> listas.getCell(`A${i+1}`).value = n);
  listas.state = "veryHidden";

  const N = categorias.length;
  for (let row=2; row<=1000; row++){
    sheet.getCell(`E${row}`).dataValidation = {
      type:"list", allowBlank:false,
      formulae:[`Listas!$A$1:$A$${N}`],
      showErrorMessage:true, errorStyle:"error",
      errorTitle:"Categoría inválida",
      error:"Seleccione una categoría de la lista."
    };
  }

  const out = '/private/tmp/claude-501/-Users-lucasquaroni-Desktop-Lumar-uesevi/e66dcfd9-31bd-4c75-ba47-9f7f2ff96eb6/scratchpad/out2.xlsx';
  await wb.xlsx.writeFile(out);

  // verify preserved structure + parse
  const wb2 = XLSX.read(fs.readFileSync(out), {type:'buffer'});
  console.log("Sheets:", wb2.SheetNames);
  const ws = wb2.Sheets[wb2.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws);
  console.log("Filas de datos parseadas:", data.length);
  const fk = k => k.toLowerCase().replace(/\s+/g,"_").replace(/[^\w_]/g,"");
  console.log("Headers normalizados:", Object.keys(data[0]).map(fk));
  console.log("Fila1:", JSON.stringify(data[0]));
  console.log("Fila2:", JSON.stringify(data[1]));

  // verify styling preserved on header
  const wb3 = new ExcelJS.Workbook();
  await wb3.xlsx.readFile(out);
  const s3 = wb3.worksheets[0];
  console.log("Sheet0 name:", JSON.stringify(s3.name));
  console.log("A1 fill:", JSON.stringify(s3.getCell('A1').fill));
  console.log("A1 font:", JSON.stringify(s3.getCell('A1').font));
  console.log("Listas state:", wb3.getWorksheet('Listas').state);
  // dropdown xml
  const valXml = fs.readFileSync('/dev/stdin');
})().catch(e=>{console.error(e);process.exit(1);});
