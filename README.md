# 🎵 ColorTune: Color-Based Music Recommender 🎨

**Programmers Dev Course 데이터분석 3기 최종 프로젝트**

ColorTune은 색상에 따른 분위기를 분석하여 사용자에게 음악을 추천해주는 웹 애플리케이션입니다.  
사용자는 R, G, B, Noise 값을 조정해 만든 색상을 통해 추천된 10곡의 음악을 받을 수 있습니다.

현재는 Spotify 키워드를 기준으로 미리 수집한 5,439개의 음악 데이터를 EDA 기반으로 라벨링하여 추천하는 구조입니다.  
이후 **DB 연동, 곡 데이터 확장, Spotify 로그인 기능** 등을 추가하여 개인화 추천 기능을 개선할 예정입니다.

---

## 🎶 프로젝트 개요

- **주요 기능**: 색상 기반 분위기 분석, 음악 추천
- **사용 기술**: React, Flask, Spotify API, ColorThief

---

## 📆 개발 기간 및 팀 구성

- **개발 기간**: 2025.07.29 ~ 2025.09.02 (총 5주)
- **프로젝트 유형**: 팀 프로젝트 (3인)

### 👥 팀원 및 역할

- 👤 **김다현** – 외부 데이터 수집, 웹 풀스택 개발 (React + Flask)
  - Spotify 키워드 기반 플레이리스트 수집
  - React 기반 UI 개발 및 상태 관리
  - Flask 서버 구축 및 Spotify API 통신
  - EDA 초안 작업: 데이터 분포 확인, 전처리, 클러스터링(PCA & K-Means)

- 👤 **황석준** – 추천 로직 설계 및 서버 기능 확장
  - 색상 분위기 매핑 로직 구현
  - 추천 알고리즘 설계 및 파라미터 튜닝
  - 슬랙 봇 서버 연동
  - EDA 초안 작업: 색상 관련 특성 간 상관관계 분석, 클러스터링

- 👤 **황영우** – 데이터 클렌징 및 검증
  - 최종 EDA 수행 및 대표 색상 선정
  - 라벨 정제 및 감성 키워드 보완
  - EDA 초안 분석 검토 및 오류 수정
---

## 🎯 프로젝트 목적
- 색상이 주는 감정과 분위기를 음악 추천에 연결하여 **새로운 사용자 경험 제공**
- 클릭/텍스트 입력 중심의 기존 추천 서비스에서 벗어나, **직관적이고 감성적인 인터페이스 구현**
- 데이터 분석 기반의 **정확하고 다양한 추천 시스템** 구축

---

## 📊 데이터셋 설명 및 전처리
- **데이터 출처**: Spotify API를 통해 수집한 총 5,439곡
  - 2014~2024년 인기 차트: 2,963곡
  - 분위기 키워드 기반 플레이리스트: 3,514곡 (중복 포함)

- **수집된 주요 컬럼**
  | 변수                  | 설명                                |
  |---------------------|-----------------------------------|
  | name                | 트랙명                              |
  | id                  | 고유 식별자                           |
  | popularity          | Spotify 기준 인기도 지표              |
  | artists             | 아티스트 이름                         |
  | album_release_date  | 앨범 발매 날짜                         |
  | mode                | 장단조                              |
  | speechiness         | 말소리의 비율                         |
  | acousticness        | 어쿠스틱 악기 비중                     |
  | instrumentalness    | 기악적인 성향                          |
  | liveness            | 라이브 공연 가능성                     |
  | tempo               | 트랙 템포                             |
  | time_signature      | 박자표                               |
  | energy              | 에너지 레벨 (역동성)                   |
  | loudness            | 평균 음량 (dB)                         |
  | valence             | 정서적 긍정성 지표                     |

- **데이터 처리 및 활용 흐름**
  - 키워드 기반으로 수집한 Spotify 곡 데이터를 EDA 수행
  - 각 곡에 대해 분위기 키워드 수집 및 색상(RGB, Opacity, Noise) 매핑
  - 분위기별 특성과 대표 색상 연결
  - 최종 매핑 데이터를 Flask 서버에서 JSON 포맷으로 관리하여 추천에 활용

- 📂 관련 파일
  - Spotify 플레이리스트 수집 코드: [`spotify_playlist_api.ipynb`](./music_EDA/playlist_extraction_code.ipynb)
  - EDA 및 클러스터링 분석 결과 (초안): [`music_EDA_Cluster.ipynb`](./music_EDA/color_music_eda_cluster.ipynb)
  - EDA 진행 시 사용했던 플레이리스트: [`playlist_2014_2016.csv`](./server/data/playlist_2014_2016.csv)
  - 최종 매핑 결과 CSV: [`remove_duplicate_music_data.csv`](./server/data/final_mapped_music.csv)


---

## 📁 프로젝트 구조

- `client/`: React 기반 프론트엔드
- `server/`: Flask 기반 백엔드 API
- `music_EDA/`: 색상 분포 및 분위기별 음악 특성 분석
- `ColorTune_보고서.pdf`: 기능 설명 및 설계 문서
- `ColorTune_발표자료.pdf`: 프로젝트 소개용 발표 자료
- `ColorTune_시연영상`: 프로젝트 결과 시연영상
---

## ⚒️ 실행 방법

### ✔️ 사전 설치

- **Node.js** (LTS 버전 권장): [https://nodejs.org](https://nodejs.org)  
  설치 후 다음 명령어로 버전 확인:
  ```bash
  node -v
  npm -v
  ```

- **Python 3.x**: [https://www.python.org](https://www.python.org)  
  설치 후 pip 버전 확인:
  ```bash
  python --version
  pip --version
  ```

현재는 로그인 기능이 없으며, Spotify Web API에서 직접 토큰을 발급받아 수동으로 입력해야 합니다.  
`server.py` 파일 내 다음 부분을 수정해주세요:

[spotipy api token 발급](https://developer.spotify.com/documentation/web-api)
로그인 > Dashboard > Crate app 생성 후 토큰발급 가능
```python
client_id = 'your_client_id'
client_secret = 'your_client_secret'
```
### ▶️ 실행 순서

1. **프론트엔드 실행**
   ```bash
   cd client
   npm install
   npm start        # http://localhost:3000 에서 실행
   ```

2. **백엔드 실행**
   ```bash
   cd ../server
   pip install -r requirements.txt  # (필요한 경우)
   python server.py
   ```

> 🔗 프론트엔드에서 백엔드 API 요청을 보낼 경우, Flask 서버의 포트(`http://localhost:5000` 등)를 사용하는지 확인해주세요.

## 🖼️ 시연 이미지 / 영상


---

## 🔧 향후 개선 방향
- Spotify 로그인 기능 추가: 사용자의 청취 이력을 반영한 개인화 추천
- DB 연동 및 데이터 확장: 곡 수 확대, 다양한 분위기 반영
- 추천 알고리즘 고도화: 유사 색상 간 거리 기반 추천 개선

---

## ⚠️ 참고사항 (2025.07.24 기준)
Spotify Web API에서는 **2024년 11월 27일**부터 `preview_url` 필드를 통한 **30초 미리듣기 링크 제공이 중단**되었습니다.
현재 해당 기능을 대체할 수 있는 방식을 검토 중이며, 추후 업데이트 예정입니다.