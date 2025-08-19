import com.jacob.activeX.ActiveXComponent;
import com.jacob.com.Dispatch;
import com.jacob.com.Variant;

public class HwpController {
    private ActiveXComponent hwp;

    public HwpController() {
        hwp = new ActiveXComponent("HWPFrame.HwpObject");
        hwp.invoke("XHwpWindows");
    }

    // 파일 관련
    public void openFile(String path) {
        Dispatch.call(hwp.getObject(), "Open", path);
    }

    public void saveFile() {
        Dispatch.call(hwp.getObject(), "Save");
    }

    public void saveAs(String path) {
        Dispatch.call(hwp.getObject(), "SaveAs", path);
    }

    public void closeFile() {
        Dispatch.call(hwp.getObject(), "Quit");
    }

    // 텍스트 관련
    public void insertText(String text) {
        Dispatch.call(hwp.getObject(), "InsertText", text);
    }

    public String getText() {
        return Dispatch.call(hwp.getObject(), "GetText").toString();
    }

    public void deleteText(int start, int end) {
        Dispatch.call(hwp.getObject(), "DeleteText", new Variant(start), new Variant(end));
    }

    // 표 관련
    public void insertTable(int rows, int cols) {
        Dispatch.call(hwp.getObject(), "InsertTable", new Variant(rows), new Variant(cols));
    }

    public String getCellText(int tableIndex, int row, int col) {
        return Dispatch.call(hwp.getObject(), "GetCellText", new Variant(tableIndex), new Variant(row), new Variant(col)).toString();
    }

    public void setCellText(int tableIndex, int row, int col, String text) {
        Dispatch.call(hwp.getObject(), "SetCellText", new Variant(tableIndex), new Variant(row), new Variant(col), text);
    }

    // 이미지 삽입
    public void insertImage(String imagePath) {
        Dispatch.call(hwp.getObject(), "InsertPicture", imagePath);
    }

    // 단락
    public String getParagraph(int index) {
        return Dispatch.call(hwp.getObject(), "GetParagraph", new Variant(index)).toString();
    }

    public void setParagraphStyle(int index, String style) {
        Dispatch.call(hwp.getObject(), "SetParagraphStyle", new Variant(index), style);
    }

    // 검색 및 치환
    public void findReplace(String findText, String replaceText) {
        Dispatch.call(hwp.getObject(), "FindReplace", findText, replaceText);
    }

    // 페이지
    public int getPageCount() {
        return Dispatch.call(hwp.getObject(), "GetPageCount").getInt();
    }
}
