import { join } from "node:path";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, shell, nativeImage } from "electron";
import iconSvg from "../../resources/Bartender.svg?asset";
import iconIcns from "../../resources/Bartender.icns?asset";
import iconIco from "../../resources/Bartender.ico?asset";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Bartender",
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    maxWidth: 1920,
    maxHeight: 1080,
    show: false,
    autoHideMenuBar: true,
    icon: process.platform === "darwin" ? iconIcns : process.platform === "win32" ? iconIco : iconSvg,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    // URL 검증 - 안전한 프로토콜만 허용
    const allowedProtocols = ["http:", "https:", "mailto:", "tel:"];
    try {
      const urlObj = new URL(details.url);
      if (allowedProtocols.includes(urlObj.protocol)) {
        shell.openExternal(details.url);
      }
    } catch (error) {
      console.warn("Invalid URL blocked:", details.url);
    }
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// Set app name early for menu bar
app.setName("Bartender");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.hwangjunhyeok.bartender");

  // Set dock icon for macOS
  if (process.platform === "darwin" && app.dock) {
    const iconPath = join(__dirname, "../../resources/Bartender.icns");
    const image = nativeImage.createFromPath(iconPath);
    if (!image.isEmpty()) {
      app.dock.setIcon(image);
    }
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => {
    // IPC 핑 처리 - 민감 정보 로깅 방지
    if (process.env.NODE_ENV === "development") {
      console.log("pong");
    }
  });

  createWindow();

  app.on("activate", () => {
    // On macOS it's sidebar to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's sidebar
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
