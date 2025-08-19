// node-mcp-server/controllers/ExcelController.ts
import * as ActiveX from "winax";

export class ExcelController {
  private excel: any;
  private workbook: any;

  constructor() {
    // Excel COM 객체 생성
    this.excel = new ActiveX.Object("Excel.Application");
    this.excel.Visible = true; // 화면 표시 여부
  }

  // ---------------- 파일 ----------------
  openFile(path: string) {
    this.workbook = this.excel.Workbooks.Open(path);
  }

  saveFile() {
    if (this.workbook) this.workbook.Save();
  }

  saveAs(path: string) {
    if (this.workbook) this.workbook.SaveAs(path);
  }

  closeFile() {
    if (this.workbook) this.workbook.Close(false);
    this.excel.Quit();
  }

  // ---------------- 시트 관리 ----------------
  createSheet(sheetName: string) {
    const sheet = this.workbook.Sheets.Add();
    sheet.Name = sheetName;
  }

  deleteSheet(sheetName: string) {
    const sheet = this.workbook.Sheets(sheetName);
    sheet.Delete();
  }

  renameSheet(oldName: string, newName: string) {
    const sheet = this.workbook.Sheets(oldName);
    sheet.Name = newName;
  }

  // ---------------- 셀/범위 ----------------
  writeCell(sheetName: string, row: number, col: number, value: string | number) {
    const sheet = this.workbook.Sheets(sheetName);
    sheet.Cells(row, col).Value = value;
  }

  readCell(sheetName: string, row: number, col: number): string {
    const sheet = this.workbook.Sheets(sheetName);
    return sheet.Cells(row, col).Value?.toString() ?? "";
  }

  clearRange(sheetName: string, range: string) {
    const sheet = this.workbook.Sheets(sheetName);
    sheet.Range(range).ClearContents();
  }

  // ---------------- 행/열 ----------------
  insertRow(sheetName: string, rowIndex: number) {
    const sheet = this.workbook.Sheets(sheetName);
    sheet.Rows(rowIndex).Insert();
  }

  deleteRow(sheetName: string, rowIndex: number) {
    const sheet = this.workbook.Sheets(sheetName);
    sheet.Rows(rowIndex).Delete();
  }

  insertColumn(sheetName: string, colIndex: number) {
    const sheet = this.workbook.Sheets(sheetName);
    sheet.Columns(colIndex).Insert();
  }

  deleteColumn(sheetName: string, colIndex: number) {
    const sheet = this.workbook.Sheets(sheetName);
    sheet.Columns(colIndex).Delete();
  }

  // ---------------- 수식/차트/테이블 ----------------
  setFormula(sheetName: string, row: number, col: number, formula: string) {
    const sheet = this.workbook.Sheets(sheetName);
    sheet.Cells(row, col).Formula = formula;
  }

  createChart(sheetName: string, range: string, chartType: string) {
    const sheet = this.workbook.Sheets(sheetName);
    const chart = sheet.Shapes.AddChart2(251, chartType).Chart;
    chart.SetSourceData(sheet.Range(range));
  }

  createTable(sheetName: string, range: string, tableName: string) {
    const sheet = this.workbook.Sheets(sheetName);
    sheet.ListObjects.Add(1, sheet.Range(range)).Name = tableName;
  }

  // ---------------- 매크로 ----------------
  runMacro(macroName: string) {
    this.excel.Run(macroName);
  }
}
