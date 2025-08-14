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

## 🔧 주요 디렉토리 상세

### `src/main/` - Electron 메인 프로세스
**역할**: Node.js 환경에서 실행되는 Electron의 핵심 프로세스

```
src/main/
└── index.ts                      # 메인 프로세스 엔트리포인트
```

**담당 업무**:
- 브라우저 윈도우 생성/관리
- 시스템 API 접근 (파일시스템, OS 기능)
- IPC 통신 서버 역할
- 앱 라이프사이클 관리
- 보안 설정 (CSP, 권한 등)

---

### `src/preload/` - 프리로드 스크립트
**역할**: 메인 프로세스와 렌더러 프로세스 간 안전한 브릿지

```
src/preload/
├── index.ts                      # 프리로드 스크립트 구현
└── index.d.ts                    # TypeScript 타입 정의
```

**담당 업무**:
- 메인 프로세스 API를 렌더러에 안전하게 노출
- IPC 통신 인터페이스 제공
- 보안 컨텍스트에서 권한 있는 작업 수행
- `window.electron` API 제공

---

### `src/renderer/` - React 렌더러 프로세스
**역할**: 사용자 인터페이스를 담당하는 웹 기반 프론트엔드

```
src/renderer/
├── index.html                    # HTML 엔트리포인트
├── main.tsx                      # React 앱 엔트리포인트
├── App.tsx                       # 루트 React 컴포넌트
├── env.d.ts                      # 환경 타입 정의
├── components/                   # React 컴포넌트들
│   └── Versions.tsx
└── assets/                       # 정적 리소스
    ├── base.css                  # 기본 스타일
    ├── main.css                  # 메인 스타일
    ├── electron.svg              # 로고 이미지
    └── wavy-lines.svg           # 배경 이미지
```

**담당 업무**:
- 사용자 인터페이스 렌더링
- 사용자 인터랙션 처리
- 상태 관리
- 메인 프로세스와 IPC 통신

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