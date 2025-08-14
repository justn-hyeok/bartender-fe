# Project Architecture

## 📁 폴더 구조

```
bartender-fe/
├── src/                          # 소스 코드
│   ├── main/                     # Electron 메인 프로세스
│   ├── preload/                  # 프리로드 스크립트
│   └── renderer/                 # React 렌더러 프로세스
├── resources/                    # 앱 리소스 (아이콘 등)
├── build/                        # 빌드용 리소스
├── out/                          # 빌드 결과물
├── dist/                         # 배포용 패키징 결과물
└── 설정 파일들
```

---

## 🔧 Electron 아키텍처 상세

### 📱 `resources/` - 네이티브 앱 리소스
**역할**: 운영체제 레벨에서 사용되는 네이티브 리소스

```
resources/
└── icon.png                      # 앱 아이콘 (macOS Dock, Windows 작업표시줄 등)
```

**특징**:
- **패키징 시 번들에 포함**: `electron-builder`가 자동으로 앱에 포함
- **운영체제 통합**: Dock 아이콘, 알림 아이콘, 작업표시줄 등에 사용
- **플랫폼별 최적화**: macOS용 ICNS, Windows용 ICO로 자동 변환
- **접근 방식**: 메인 프로세스에서 `import icon from "../../resources/icon.png?asset"`로 참조

---

### 🖥️ `src/main/` - Electron 메인 프로세스 (백엔드)
**역할**: Node.js 환경에서 실행되는 Electron의 핵심 제어 프로세스

```
src/main/
└── index.ts                      # 메인 프로세스 엔트리포인트
```

**핵심 역할**:
- **앱 라이프사이클 제어**: 시작, 종료, 창 관리
- **BrowserWindow 관리**: 창 생성, 크기 조절, 최소화/최대화
- **시스템 API 접근**: 파일 시스템, 네이티브 메뉴, 트레이, 알림
- **보안 게이트웨이**: 렌더러 프로세스의 권한 제어
- **IPC 서버**: `ipcMain.on()`, `ipcMain.handle()`로 통신 수신

**실행 환경**: Node.js (모든 Node.js API 사용 가능)

**주요 코드 예시**:
```typescript
// 창 생성 및 관리
const mainWindow = new BrowserWindow({
  width: 900, height: 670,
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false
  }
})

// IPC 통신 처리
ipcMain.on('ping', () => console.log('pong'))
```

---

### 🌉 `src/preload/` - 보안 브릿지 스크립트
**역할**: 메인 프로세스와 렌더러 프로세스 간 안전한 통신 다리

```
src/preload/
├── index.ts                      # 프리로드 스크립트 구현
└── index.d.ts                    # TypeScript 타입 정의 (window.electron 등)
```

**핵심 역할**:
- **API 노출 제어**: `contextBridge.exposeInMainWorld()`로 안전하게 API 노출
- **보안 경계**: 메인 프로세스의 강력한 권한을 제한적으로만 렌더러에 제공
- **IPC 인터페이스**: 렌더러가 메인 프로세스와 통신할 수 있는 방법 제공
- **타입 안전성**: TypeScript 타입 정의로 개발 시 자동완성 지원

**실행 환경**: 제한된 Node.js (일부 Node.js API만 사용 가능)

**보안 원칙**:
- 렌더러 프로세스는 직접적으로 Node.js API에 접근 불가
- preload 스크립트를 통해서만 제한된 기능 사용 가능
- `contextBridge`를 통해 명시적으로 노출된 API만 사용

**주요 코드 예시**:
```typescript
// 안전한 API 노출
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    // 특정 채널만 허용하는 제한적 접근
  }
})
```

---

### 🎨 `src/renderer/` - React 프론트엔드 (UI)
**역할**: 사용자가 보고 상호작용하는 웹 기반 인터페이스

```
src/renderer/
├── index.html                    # HTML 엔트리포인트
├── main.tsx                      # React 앱 엔트리포인트
├── App.tsx                       # 루트 React 컴포넌트
├── env.d.ts                      # 환경 타입 정의
├── components/                   # React 컴포넌트들
│   └── Versions.tsx
└── assets/                       # 정적 리소스
    ├── fonts.css                 # 폰트 정의
    ├── fonts/                    # Variable Font 파일들
    ├── base.css                  # 기본 스타일
    ├── main.css                  # 메인 스타일
    ├── electron.svg              # 로고 이미지
    └── wavy-lines.svg           # 배경 이미지
```

**핵심 역할**:
- **UI 렌더링**: React 컴포넌트로 사용자 인터페이스 구성
- **사용자 상호작용**: 클릭, 입력 등 이벤트 처리
- **상태 관리**: React state, context 등을 통한 앱 상태 관리
- **스타일링**: CSS, Variable Fonts를 통한 시각적 디자인
- **메인 프로세스 통신**: `window.electron` API를 통한 IPC 통신

**실행 환경**: Chromium 웹 엔진 (웹 표준 API만 사용 가능, Node.js API 직접 접근 불가)

**보안 제약**:
- 파일 시스템 직접 접근 불가
- 시스템 API 직접 호출 불가
- preload 스크립트를 통해 노출된 API만 사용 가능

**주요 코드 예시**:
```typescript
// IPC 통신 (preload를 통해 노출된 API 사용)
const handleClick = () => {
  window.electron.ipcRenderer.send('ping')
}

// 일반적인 React 컴포넌트
function App() {
  return <button onClick={handleClick}>Send IPC</button>
}
```

---

## 🛠️ 빌드 결과물

### `out/` - 개발 빌드 결과물
Vite로 빌드된 개발용 결과물

```
out/
├── main/                         # 빌드된 메인 프로세스
│   └── index.js
├── preload/                      # 빌드된 프리로드 스크립트
│   └── index.js
└── renderer/                     # 빌드된 렌더러
    ├── index.html
    └── assets/
```

### `dist/` - 배포용 패키지
electron-builder로 생성된 배포 가능한 앱 패키지

```
dist/
├── bartender-fe-1.0.0.dmg       # macOS DMG
├── bartender-fe-1.0.0.exe       # Windows 설치 프로그램
└── bartender-fe-1.0.0.AppImage  # Linux AppImage
```

---

## ⚙️ 설정 파일들

### 핵심 설정
- **`package.json`**: 프로젝트 메타데이터 및 의존성
- **`electron.vite.config.ts`**: Vite 빌드 설정
- **`electron-builder.yml`**: 앱 패키징 설정

### TypeScript 설정
- **`tsconfig.json`**: 전체 프로젝트 TS 설정
- **`tsconfig.node.json`**: Node.js 환경 (main/preload)
- **`tsconfig.web.json`**: 웹 환경 (renderer)

### 개발 도구
- **`biome.json`**: 린터/포맷터 설정
- **`.gitignore`**: Git 무시 파일 목록

### 리소스
- **`resources/`**: 앱 아이콘, 네이티브 리소스
- **`build/`**: 빌드용 추가 리소스

---

## 🔄 프로세스간 통신 구조

```
┌─────────────────┐    IPC    ┌─────────────────┐    Context   ┌─────────────────┐
│   Main Process  │ ←────────→ │ Preload Script  │ ←──Bridge──→ │ Renderer Process │
│   (Node.js)     │           │  (Sandboxed)    │             │    (React)      │
├─────────────────┤           ├─────────────────┤             ├─────────────────┤
│ • File System   │           │ • IPC Interface │             │ • User Interface│
│ • OS APIs       │           │ • Security Layer│             │ • Event Handling│
│ • Window Mgmt   │           │ • API Exposure  │             │ • State Mgmt    │
└─────────────────┘           └─────────────────┘             └─────────────────┘
```

---

## 📦 개발 흐름

1. **개발**: `pnpm dev` → Hot reload로 실시간 개발
2. **빌드**: `pnpm build` → `out/` 디렉토리에 결과물 생성
3. **패키징**: `pnpm build:mac/win/linux` → `dist/` 에 배포용 패키지 생성
4. **배포**: `dist/`의 패키지를 사용자에게 배포