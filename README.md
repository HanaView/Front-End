# 💻 설치

```

# install
Front-End> npm i
```

# ✨ 사용

```
# run
Front-End> npm run dev

```

# 📕 핵심기술
## 📹 WebRTC
- WebRTC는 "Web Real-Time Communication"의 약자로, 웹 브라우저 간에 플러그인 없이 실시간 음성, 비디오 및 텍스트를 공유할 수 있는 오픈 소스입니다. 
- 이 기술을 사용하여 저희는 화상 상담 서비스를 구현했습니다.
- 인스타그램 라이브, 유튜브 라이브, 트위치 등 실시간 스트리밍은 RTMP 방식을 사용합니다. 장단점을 가지고 있지만 WebRTC는 RTMP 방식과 비교 했을때 더 낮은 레이턴시를 갖고 있어 실시간에 가까운 스트리밍을 제공합니다.


# 🧩 프론트엔드 구조
## 공통 컴포넌트 개발

<img width="1224" alt="image" src="https://github.com/HanaView/Front-End/assets/71822139/3003ae40-be6c-45f4-81ca-b35ee8e52816">

![프론트엔드구조](https://github.com/HanaView/Front-End/assets/71822139/a61ca78a-76a2-4291-8c0f-ab6fbb7b7d80)


### Storybook
- 분리된 UI 컴포넌트를 체계적이고 효율적으로 구축할 수 있는 UI 컴포넌트 개발 도구 
-  UI 컴포넌트가 각각 독립적으로 어떻게 실제로 랜더링되는지 코드를 보지않고 직접 시각적으로 테스트하면서 개발을 진행할 수 있음 
### SASS
- Sass는 CSS에서 사용할 수 없는 변수 기능을 제공하여 스타일 시트를 보다 효율적으로 작성할 수 있게 함
- 변수를 사용하면 한 곳에서 값을 변경하는 것만으로 전체 프로젝트에 적용된 스타일을 쉽게 업데이트할 수 있음
-> 유지보수성 & 일관성 & 재사용성 용이

## Axios Instance
<img width="1221" alt="image" src="https://github.com/HanaView/Front-End/assets/71822139/0a7e0b6a-0418-4bde-a397-23013ec32c51">

- Axios 인스턴스는 Axios 라이브러리를 통해 생성된 하나의 독립된 HTTP 클라이언트
- 요청마다 headers의 인증 값, 토큰 값을 반복적으로 설정할 필요 없이, 인스턴스를 사용하여 코드의 중복을 줄일 수 있음
- 요청 및 응답 인터셉터를 인스턴스에 설정하여, 요청 전/후의 공통 로직을 처리할 수 있음

- ex) 응답 상태가 403인 경우, 토큰이 만료된 것으로 간주하고 토큰을 갱신
- 갱신된 토큰을 사용하여 원래 요청을 다시 시도
