# KPP

Korean Pop People의 줄임말로, 한국 대중가요에 대한 소개 및 커뮤니티 사이트입니다.

한국 대중가요 뮤직비디오 재생, 가요계 엔터테이먼트의 실시간 주가 확인 기능
한국 대중가요의 간단한 역사 소개, 게시판, 실시간 채팅 서비스

- 진행 기간 : 2021-03-08 ~ 2021-03-24
- 사이트 링크 : <http://boovelop.duckdns.org:3001/>
- 블로그 기록 : <https://velog.io/@goblin820/%EA%B0%9C%EC%9D%B8-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-KPP-1>
- 2022-08 리팩토링 및 버그 수정 진행중, [리팩토링 하면서 고민한 흔적](https://github.com/trevor1107/KPP/blob/main/think.md)

## 개발 환경

- OS: windows 10
- Node.js: v15.11.0

## 사용 기술 및 라이브러리

- JavaScript, Pug, CSS, jQuery
- Node.js, Express, MySQL, Sequelize, socket.io
- KaKao API, Oracle Cloud

## 구현 기술

### HTML

- pug 템플릿으로 화면 구성

### Auth

- 카카오 API 연동 로그인 및 로그아웃

### 메인 페이지

- 로컬 비디오 파일 랜덤 재생, 비디오 옵션 설정
- 실시간 주식 정보 스크랩, 상하 자동 스크롤 모션으로 표시
- 특정 폴더의 파일들을 동적으로 추가하여 슬라이드 이미지 표시(SlickSlider)
- 로컬 json파일 파싱하여 슬라이더 이미지 클릭 시 해당 유튜브 영상 팝업 표시

### KPOP 페이지

- 대중가요 역사를 소개하는 스크롤링 애니메이션

### Community 페이지

- 게시판 CRUD, SummerNote Editor 활용 및 이미지 업로드 커스터마이징
- socket.io 실시간 1:n 채팅

### DB

- Sequelize 활용 RDB 설계 및 관리

## 배포

- OracleCloud 인스턴싱 컴퓨팅 서버에 배포, DNS 및 포트 포워딩 설정
- 환경 변수 파일(.env)은 FTP 프로그램 FileZilla를 이용하여 전송

### 환경 변수(env) 목록

PORT
KAKAO_KEY
COOKIE_SECRET
DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
DATABASE_USER
DATABASE_PASS
