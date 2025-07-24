from flask import Flask, jsonify, redirect, request, url_for, flash
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
import requests
import base64

## 함수 정의 목록 ##
# 1. label_R(value): 빨간색 값에 따른 라벨 생성
# 2. label_G(value): 초록색 값에 따른 라벨 생성
# 3. label_B(value): 파란색 값에 따른 라벨 생성
# 4. label_opacity(value): 불투명도에 따른 라벨 생성
# 5. label_noise(value): 노이즈 값에 따른 라벨 생성
# 6. get_token(client_id, client_secret): Spotify API 토큰 발급
# 7. find_music_atom(red, green, blue, opacity, noise): 라벨들을 조합해 아톰 생성

## 함수
### 사용자 토큰 가져오기 함수
def get_token(client_id, client_secret):
    # 토큰을 얻기 위한 URL
    auth_url = 'https://accounts.spotify.com/api/token'

    # 클라이언트 ID와 시크릿을 base64로 인코딩
    auth_header = base64.b64encode(f'{client_id}:{client_secret}'.encode('utf-8')).decode('utf-8')

    # 헤더 설정
    headers = {
        'Authorization': f'Basic {auth_header}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    # 토큰 요청
    data = {
        'grant_type': 'client_credentials'
    }
    response = requests.post(auth_url, headers=headers, data=data)

    
    if response.status_code == 200:
        token_info = response.json()
        return token_info.get('access_token')
    else: # 토큰 받지 못한 경우
        raise Exception("Failed to retrieve access token")
    


#### 값을 읽어서 라벨링 하는 함수
def label_R(value):
    if value <= 63:
        return '차가운,'
    elif value <= 127:
        return '중립적인,'
    elif value <= 191:
        return '따뜻한,'
    else:
        return '강렬한,'
def label_G(value):
    if value <= 63:
        return '차분한,'
    elif value <= 127:
        return '평온한,'
    elif value <= 191:
        return '안정적인,'
    else:
        return '활기찬,'
def label_B(value):
    if value <= 63:
        return '무거운,'
    elif value <= 127:
        return '중립적인,'
    elif value <= 191:
        return '청량한,'
    else:
        return '신비로운,'
def label_opacity(value):
    if value <= 64:
        return '저명한,'
    elif value <= 79:
        return '보통의,'
    else:
        return '높은,'
def label_noise(value):
    if value <= 19:
        return '깨끗한'
    elif value <= 39:
        return '약간의 빈티지한'
    elif value <= 59:
        return '빈티지한'
    elif value <= 79:
        return '강한 빈티지한'
    else:
        return '매우 빈티지한'

### 라벨링 된 값을 조합해 음악을 찾는 함수
def find_music_atom(red, green, blue, opacity, noise):
    atom = label_R(red) + label_G(green) + label_B(blue) + label_opacity(opacity) + label_noise(noise)
    print(atom)
    return atom

## 테스트용 토큰 (커밋하기 전에 정보 지우기)
client_id = '여기에 입력'
client_secret = '여기에 입력'
use_col = ['name', 'artists', 'R', 'G', 'B', 'opacity', 'noise', 'id', 'atmosphere']
csv_file_path = './server/data/final_mapped_music.csv'
df = pd.read_csv(csv_file_path, usecols=use_col)

app = Flask(__name__)
CORS(app)  # 모든 도메인에서의 요청을 허용


data = df.to_dict(orient='records') 

@app.route('/')
def index():
    return "CSV Data Loaded"

@app.route('/find_tracks', methods=['POST'])
def find_tracks():
    try:
        data = request.json
        red = data['red']
        green = data['green']
        blue = data['blue']
        opacity = data['opacity']
        noise = data['noise']

        #[DEBUG]
        print(red, green, blue, opacity, noise)

        atom = find_music_atom(red, green, blue, opacity, noise)

        # 거리 계산 및 가장 가까운 트랙 찾기
        # 1. np로 계산 2. 사이킷런 유클리드 거리 계산 
        # 현재는 그냥 계산하는 방법으로 했습니다
        df['distance'] = np.sqrt(
            (df['R'] - red) ** 2 +
            (df['G'] - green) ** 2 +
            (df['B'] - blue) ** 2 +
            (df['opacity'] - opacity) ** 2 +
            (df['noise'] - noise) ** 2
        )

        closest_tracks = df.nsmallest(10, 'distance')[['name', 'artists', 'R', 'G', 'B', 'opacity', 'noise', 'id', 'atmosphere']].to_dict(orient='records')
        print(closest_tracks)
        return jsonify({'tracks': closest_tracks, 'atom': atom})
    
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500
      
@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.get_json()
    track_id = data['id']

    url = f"https://api.spotify.com/v1/tracks/{track_id}"

    access_token = get_token(client_id, client_secret)
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get(url, headers=headers)
    track_data = response.json()
    preview_url = track_data.get('preview_url')

    
    return jsonify({"status": "success", "preview_url": preview_url})

if __name__ == '__main__':
    app.run(debug=True)


