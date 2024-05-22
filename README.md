# 설치

```

# install
Front-End> npm i
```

# 사용

```
# run
Front-End> npm run dev

```

# 핵심기술

- Monorepo : https://turbo.build/
- Atomic Design : https://bradfrost.com/blog/post/atomic-web-design/
- MFA : https://colorverse.atlassian.net/wiki/spaces/CV/pages/150077821
- Typescript : https://www.typescriptlang.org/

# 구조

- /apps : App이 모여 있는 폴더.
  - app-container : MFA를 구현하기 위한 app.
  - app-land : 컬러버스 랜드플레이어 app.
  - app-lobby : 컬러버스 로비를 위한 app.
- /packages : apps에서 공통적으로 사용되는 컴포넌트를 모아놓은 폴더.
  - ui : apps내에서 공통적으로 사용되는 UI 컴포넌트 모음.
  - apis : 서버 API와 연동되는 스키마 정의가 모여있는 폴더.
  - clients : 클라이언트와 연동되는 스키마 정의가 모여있는 폴더.

# 테스트
