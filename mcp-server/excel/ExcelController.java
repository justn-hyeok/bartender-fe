// ExcelController.java
import com.jacob.activeX.ActiveXComponent;
import com.jacob.com.Dispatch;
import com.jacob.com.Variant;

public class ExcelController {
    private ActiveXComponent excel;

    public ExcelController() {
        excel = new ActiveXComponent("Excel.Application");
        excel.setProperty("Visible", true);
    }

    // ======================
    // 파일
    // ======================
    public void openFile(String path) {
        Dispatch.call(excel.getProperty("Workbooks").toDispatch(), "Open", path);
    }

    public void saveFile() {
        Dispatch.call(excel.getProperty("ActiveWorkbook").toDispatch(), "Save");
    }

    public void closeFile() {
        Dispatch.call(excel.getProperty("ActiveWorkbook").toDispatch(), "Close", false);
    }

    // ======================
    // 셀 / 범위
    // ======================
    public void writeCell(String sheetName, int row, int col, String value) {
        Dispatch sheet = Dispatch.call(excel.getProperty("Sheets").toDispatch(), "Item", sheetName).toDispatch();
        Dispatch.put(Dispatch.call(sheet, "Cells", row, col).toDispatch(), "Value", value);
    }

    public String readCell(String sheetName, int row, int col) {
        Dispatch sheet = Dispatch.call(excel.getProperty("Sheets").toDispatch(), "Item", sheetName).toDispatch();
        return Dispatch.get(Dispatch.call(sheet, "Cells", row, col).toDispatch(), "Value").toString();
    }

    public void mergeCells(String sheetName, int startRow, int startCol, int endRow, int endCol) {
        Dispatch sheet = Dispatch.call(excel.getProperty("Sheets").toDispatch(), "Item", sheetName).toDispatch();
        Dispatch range = Dispatch.call(sheet, "Range",
            String.format("%s%d:%s%d", colToLetter(startCol), startRow, colToLetter(endCol), endRow)).toDispatch();
        Dispatch.put(range, "MergeCells", true);
    }

    // ======================
    // 행 / 열
    // ======================
    public void insertRow(String sheetName, int row) {
        Dispatch sheet = Dispatch.call(excel.getProperty("Sheets").toDispatch(), "Item", sheetName).toDispatch();
        Dispatch rows = Dispatch.get(sheet, "Rows").toDispatch();
        Dispatch rowRange = Dispatch.call(rows, "Item", row).toDispatch();
        Dispatch.call(rowRange, "Insert");
    }

    public void deleteRow(String sheetName, int row) {
        Dispatch sheet = Dispatch.call(excel.getProperty("Sheets").toDispatch(), "Item", sheetName).toDispatch();
        Dispatch rows = Dispatch.get(sheet, "Rows").toDispatch();
        Dispatch rowRange = Dispatch.call(rows, "Item", row).toDispatch();
        Dispatch.call(rowRange, "Delete");
    }

    // ======================
    // 수식
    // ======================
    public void setFormula(String sheetName, int row, int col, String formula) {
        Dispatch sheet = Dispatch.call(excel.getProperty("Sheets").toDispatch(), "Item", sheetName).toDispatch();
        Dispatch cell = Dispatch.call(sheet, "Cells", row, col).toDispatch();
        Dispatch.put(cell, "Formula", formula);
    }

    // ======================
    // 시트
    // ======================
    public void addSheet(String sheetName) {
        Dispatch sheets = excel.getProperty("Sheets").toDispatch();
        Dispatch newSheet = Dispatch.call(sheets, "Add").toDispatch();
        Dispatch.put(newSheet, "Name", sheetName);
    }

    public void deleteSheet(String sheetName) {
        Dispatch sheet = Dispatch.call(excel.getProperty("Sheets").toDispatch(), "Item", sheetName).toDispatch();
        Dispatch.call(sheet, "Delete");
    }

    // ======================
    // 매크로
    // ======================
    public void runMacro(String macroName) {
        Dispatch.call(excel, "Run", macroName);
    }

    // ======================
    // 헬퍼
    // ======================
    private String colToLetter(int col) {
        StringBuilder sb = new StringBuilder();
        while (col > 0) {
            int rem = (col - 1) % 26;
            sb.insert(0, (char)(rem + 'A'));
            col = (col - 1) / 26;
        }
        return sb.toString();
    }
}
