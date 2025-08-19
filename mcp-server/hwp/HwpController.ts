// node-mcp-server/controllers/hwp.ts
import { spawn } from 'child_process';

export class HwpController {
  private javaMcpPath: string;

  constructor(javaMcpPath: string) {
    this.javaMcpPath = javaMcpPath; // HwpController.jar 위치
  }

  private runCommand(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const proc = spawn('java', ['-jar', this.javaMcpPath, ...args]);

      let output = '';
      proc.stdout.on('data', (data) => (output += data.toString()));
      proc.stderr.on('data', (data) => console.error(`[HWP MCP ERROR] ${data}`));
      proc.on('close', (code) => (code === 0 ? resolve(output.trim()) : reject(new Error(`Exited ${code}`))));
    });
  }

  async openFile(path: string) { return this.runCommand(['openFile', path]); }
  async saveFile() { return this.runCommand(['saveFile']); }
  async saveAs(path: string) { return this.runCommand(['saveAs', path]); }
  async closeFile() { return this.runCommand(['closeFile']); }

  async insertText(text: string) { return this.runCommand(['insertText', text]); }
  async getText() { return this.runCommand(['getText']); }
  async deleteText(start: number, end: number) { return this.runCommand(['deleteText', start.toString(), end.toString()]); }

  async insertTable(rows: number, cols: number) { return this.runCommand(['insertTable', rows.toString(), cols.toString()]); }
  async getCellText(tableIndex: number, row: number, col: number) { return this.runCommand(['getCellText', tableIndex.toString(), row.toString(), col.toString()]); }
  async setCellText(tableIndex: number, row: number, col: number, text: string) { return this.runCommand(['setCellText', tableIndex.toString(), row.toString(), col.toString(), text]); }

  async insertImage(imagePath: string) { return this.runCommand(['insertImage', imagePath]); }

  async getParagraph(index: number) { return this.runCommand(['getParagraph', index.toString()]); }
  async setParagraphStyle(index: number, style: string) { return this.runCommand(['setParagraphStyle', index.toString(), style]); }

  async findReplace(findText: string, replaceText: string) { return this.runCommand(['findReplace', findText, replaceText]); }

  async getPageCount() { return this.runCommand(['getPageCount']); }
}
