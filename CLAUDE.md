# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Development
pnpm dev                    # Start Electron app in development mode with hot reload

# Building
pnpm build                  # TypeScript check + Vite build (outputs to out/)
pnpm start                  # Preview built app without packaging

# Code Quality
pnpm lint                   # Check code with Biome
pnpm lint:fix              # Fix auto-fixable linting issues
pnpm format                # Check formatting with Biome
pnpm format:fix            # Auto-format code

# Type Checking
pnpm typecheck             # Check both Node.js and web TypeScript
pnpm typecheck:node        # Check main/preload processes only
pnpm typecheck:web         # Check renderer process only

# Distribution Builds
pnpm build:mac             # Build macOS DMG and ZIP
pnpm build:win             # Build Windows NSIS installer
pnpm build:linux           # Build Linux AppImage and DEB
```

### Package Manager
This project uses **pnpm** exclusively. All commands should use `pnpm`, not `npm` or `yarn`.

## Architecture Overview

### Electron Multi-Process Architecture
This is a standard Electron application with three distinct processes:

1. **Main Process** (`src/main/`): Node.js environment running Electron's main process
   - Manages application lifecycle and BrowserWindow instances
   - Handles system APIs, file operations, and native OS integration
   - Configured with `tsconfig.node.json`

2. **Preload Scripts** (`src/preload/`): Secure bridge between main and renderer
   - Exposes safe APIs from main process to renderer via `contextBridge`
   - Uses `@electron-toolkit/preload` for standard Electron APIs
   - Custom APIs defined in the `api` object

3. **Renderer Process** (`src/renderer/`): React web application
   - Standard React + TypeScript frontend running in Chromium
   - Configured with `tsconfig.web.json`
   - Uses `@renderer` alias pointing to `src/renderer/`

### Build System
- **electron-vite**: Handles building all three processes with separate Vite configurations
- **electron-builder**: Packages the built application into distributable formats
- Build outputs go to `out/` directory, final packages to `dist/`

### Code Quality Tools
- **Biome**: Handles both linting and formatting (replaces ESLint + Prettier)
- **TypeScript**: Strict type checking with separate configs for Node.js and web environments
- Accessibility rules are disabled (`a11y` rules off) since this is a desktop app

### Cross-Platform Considerations
- macOS builds work fully on macOS
- Windows builds work from macOS but Linux builds have limitations
- Linux snap packages disabled due to compatibility issues on macOS
- See `BUILD.md` for detailed cross-platform build guidance

### Important Configuration Files
- `electron.vite.config.ts`: Configures the build process for all three Electron processes
- `electron-builder.yml`: Configures app packaging and distribution
- `biome.json`: Code quality configuration with desktop-app-specific rules
- Multiple `tsconfig.json` files for different execution environments

### IPC Communication Pattern
The app uses Electron's IPC (Inter-Process Communication) through:
- Main process registers IPC handlers via `ipcMain.on()`
- Preload script exposes IPC methods via `contextBridge.exposeInMainWorld()`
- Renderer accesses IPC via `window.electron.ipcRenderer`

### Development Workflow
1. Run `pnpm dev` for development with hot reload
2. Use `pnpm typecheck` before commits to catch TypeScript errors
3. Use `pnpm lint:fix` and `pnpm format:fix` to maintain code quality
4. Test builds locally with `pnpm build:mac` before distribution builds

# MCP 서버
## Figma Dev Mode MCP 규칙
  - Figma Dev Mode MCP 서버는 이미지 및 SVG 에셋을 제공할 수 있는 끝점을 제공합니다.
  - 중요: Figma Dev Mode MCP 서버가 이미지 또는 SVG에 대한 로컬 호스트 소스를 반환하는 경우 해당 이미지 또는 SVG 소스를 직접 사용하세요.
  - 중요: 새로운 아이콘 패키지를 가져오거나 추가하지 마세요. 모든 에셋은 Figma 페이로드에 있어야 합니다.
  - 중요: 로컬 호스트 소스가 제공되는 경우 입력 예시를 사용하거나 생성하지 마세요.
