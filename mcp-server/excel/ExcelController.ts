import { spawn } from "child_process";

export class ExcelController {
  private jarPath: string;

  constructor(jarPath: string = "ExcelController.jar") {
    this.jarPath = jarPath;
  }

  private runMCP(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const proc = spawn("java", ["-jar", this.jarPath, ...args]);

      let output = "";
      proc.stdout.on("data", (data) => (output += data.toString()));
      proc.stderr.on("data", (data) => console.error(`[Excel MCP ERROR] ${data}`));
      proc.on("close", (code) => {
        if (code === 0) resolve(output.trim());
        else reject(new Error(`Excel MCP exited with code ${code}`));
      });
    });
  }

  // ----- 시트 관리 -----
  async createSheet(sheetName: string) {
    return this.runMCP(["createSheet", sheetName]);
  }
  async deleteSheet(sheetName: string) {
    return this.runMCP(["deleteSheet", sheetName]);
  }
  async renameSheet(oldName: string, newName: string) {
    return this.runMCP(["renameSheet", oldName, newName]);
  }

  // ----- 셀/범위 -----
  async writeCell(sheet: string, cell: string, value: string) {
    return this.runMCP(["writeCell", sheet, cell, value]);
  }
  async readCell(sheet: string, cell: string) {
    return this.runMCP(["readCell", sheet, cell]);
  }
  async clearRange(sheet: string, range: string) {
    return this.runMCP(["clearRange", sheet, range]);
  }

  // ----- 행/열 -----
  async insertRow(sheet: string, rowIndex: number) {
    return this.runMCP(["insertRow", sheet, rowIndex.toString()]);
  }
  async deleteRow(sheet: string, rowIndex: number) {
    return this.runMCP(["deleteRow", sheet, rowIndex.toString()]);
  }
  async insertColumn(sheet: string, colIndex: number) {
    return this.runMCP(["insertColumn", sheet, colIndex.toString()]);
  }
  async deleteColumn(sheet: string, colIndex: number) {
    return this.runMCP(["deleteColumn", sheet, colIndex.toString()]);
  }

  // ----- 서식 -----
  async setCellStyle(sheet: string, cell: string, styleJson: string) {
    return this.runMCP(["setCellStyle", sheet, cell, styleJson]);
  }

  // ----- 수식 -----
  async setFormula(sheet: string, cell: string, formula: string) {
    return this.runMCP(["setFormula", sheet, cell, formula]);
  }

  // ----- 차트 -----
  async createChart(sheet: string, range: string, chartType: string) {
    return this.runMCP(["createChart", sheet, range, chartType]);
  }

  // ----- 테이블 -----
  async createTable(sheet: string, range: string, tableName: string) {
    return this.runMCP(["createTable", sheet, range, tableName]);
  }

  // ----- 매크로 -----
  async runMacro(macroName: string) {
    return this.runMCP(["runMacro", macroName]);
  }
}
