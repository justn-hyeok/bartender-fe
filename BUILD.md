# Build Guide

## 빌드 스크립트

### 개발
```bash
pnpm dev          # 개발 서버 시작
```

### 로컬 빌드
```bash
pnpm build        # TypeScript 체크 + Vite 빌드
pnpm start        # 빌드된 앱 미리보기
```

### 플랫폼별 배포 빌드

#### macOS (권장)
```bash
pnpm build:mac    # DMG + ZIP 생성
```

#### Windows
```bash
pnpm build:win    # NSIS 설치 프로그램 생성
```

#### Linux
```bash
pnpm build:linux  # AppImage + DEB 패키지 생성
```

## 크로스 플랫폼 빌드 제한사항

### macOS에서 빌드 시

#### ✅ 가능한 빌드
- **macOS**: 완전 지원 (DMG, ZIP)
- **Windows**: 가능 (NSIS 설치 프로그램)
- **Linux**: 부분 지원 (DEB만, AppImage는 제한적)

#### ❌ 제한사항
- **Linux AppImage**: M1 Mac에서 x86 바이너리 호환성 문제
- **Linux Snap**: snapcraft가 macOS에서 제대로 작동하지 않음
- **macOS 코드 서명**: Developer ID 인증서 없이는 경고 발생

### 해결 방법

#### 1. 개발 단계
```bash
# macOS 빌드만 사용 (가장 안정적)
pnpm build:mac
```

#### 2. 배포 단계
- **GitHub Actions** 또는 **Docker** 사용하여 네이티브 환경에서 빌드
- 각 플랫폼별로 별도의 CI/CD 파이프라인 구성

#### 3. Linux 빌드 개선
```bash
# snap 제거됨 - AppImage와 DEB만 빌드
# electron-builder.yml에서 snap 타겟 제거함
```

## 권장 워크플로우

### 로컬 개발
1. `pnpm dev` - 개발
2. `pnpm build:mac` - 테스트용 빌드
3. `pnpm lint && pnpm typecheck` - 코드 검증

### 배포 준비
1. 로컬에서 macOS 빌드로 기능 검증
2. GitHub Actions에서 모든 플랫폼 빌드
3. 각 플랫폼별 테스트 수행

## 문제 해결

### Windows 빌드 실패
- `pnpm -r build` 오류 → `npm run build`로 수정됨
- monorepo 스크립트를 일반 프로젝트 스크립트로 변경

### Linux 빌드 실패
- snapcraft 의존성 제거
- AppImage 호환성 문제는 Docker 또는 Linux 환경에서 해결

### 코드 서명 경고
```bash
# 개발용으로는 무시 가능
# 배포용으로는 Apple Developer ID 인증서 필요
```