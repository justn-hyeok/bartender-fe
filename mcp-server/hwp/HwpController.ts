// node-mcp-server/controllers/hwp.ts
import * as ActiveX from "winax";

export class HwpController {
  private hwp: any;

  constructor() {
    // 한컴 오피스 ActiveX 객체 생성
    this.hwp = new ActiveX.Object("HWPFrame.HwpObject");
  }

  // ---------------- 파일 ----------------
  openFile(path: string) {
    return this.hwp.Open(path);
  }

  saveFile() {
    return this.hwp.Save();
  }

  saveAs(path: string) {
    return this.hwp.SaveAs(path);
  }

  closeFile() {
    return this.hwp.Quit();
  }

  // ---------------- 텍스트 ----------------
  insertText(text: string) {
    return this.hwp.InsertText(text);
  }

  getText(): string {
    return this.hwp.GetText();
  }

  deleteText(start: number, end: number) {
    return this.hwp.DeleteText(start, end);
  }

  // ---------------- 표 ----------------
  insertTable(rows: number, cols: number) {
    return this.hwp.InsertTable(rows, cols);
  }

  getCellText(tableIndex: number, row: number, col: number): string {
    return this.hwp.GetCellText(tableIndex, row, col);
  }

  setCellText(tableIndex: number, row: number, col: number, text: string) {
    return this.hwp.SetCellText(tableIndex, row, col, text);
  }

  // ---------------- 이미지 ----------------
  insertImage(imagePath: string) {
    return this.hwp.InsertPicture(imagePath);
  }

  // ---------------- 단락 ----------------
  getParagraph(index: number): string {
    return this.hwp.GetParagraph(index);
  }

  setParagraphStyle(index: number, style: string) {
    return this.hwp.SetParagraphStyle(index, style);
  }

  // ---------------- 검색 / 치환 ----------------
  findReplace(findText: string, replaceText: string) {
    return this.hwp.FindReplace(findText, replaceText);
  }

  // ---------------- 페이지 ----------------
  getPageCount(): number {
    return this.hwp.GetPageCount();
  }
}
