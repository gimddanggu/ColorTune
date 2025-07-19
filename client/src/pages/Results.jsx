import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateNoise } from './ColorControl';
import './Results.css';

function Results() {

    const [isModalOpen, setIsModalOpen] = useState(true); // 모달 상태
    const navigate = useNavigate(); // navigate 함수 사용
    const location = useLocation(); // 이전 페이지에서 값 받아오기 위해

    const { tracks, color, atom } = location.state;  // 이전 페이지에서 전달된 상태를 받아옴 (트랙바, 추천 곡)
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const currentTrack = tracks[currentTrackIndex];
    
    // 음악 재생
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);

    const atmosphereArray = currentTrack.atmosphere.split(', '); // 현재 트랙의 분위기 배열 생성
    const ColorAtmosphereArray = atom.split(','); // 선택된 컬러의 분위기

   // 트랙바에서 선택한 색상의 분위기와 일치하는 태그에 밑줄
    const highlightedText = atmosphereArray.map((atmosphere, index) => {
        // ColorAtmosphereArray 배열에 현재 atmosphere 항목이 존재하는지 확인
        const isHighlighted = ColorAtmosphereArray.includes(atmosphere);
        return (
            <span key={index} style={{ textDecoration: isHighlighted ? 'underline' : 'none' }}>
                #{atmosphere}
                {index < atmosphereArray.length - 1 ? ' ' : ''}
            </span>
        );
    });


    // 모달 열기/닫기
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSelectAgain = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    // 아티스트 이름 표기
    // 아티스트 2명 이상일 경우 ~ 및 3 이런 식으로 표기
    const artistShow = (currentTrack) => {
        const artistArray = currentTrack.artists.split(',');
        const maxArtists = 2;

        let displayedArtists = artistArray.slice(0, maxArtists).join(', ');

        if (artistArray.length > maxArtists) {
            displayedArtists += ` 및 ${artistArray.length - maxArtists}`;
        }

        return displayedArtists
    };
        
    
    // 노이즈 이미지 생성
    // 추천 곡
    const noiseImage = generateNoise(
        200, 
        200,  
        currentTrack.R,  
        currentTrack.G,  
        currentTrack.B,  
        currentTrack.opacity,  
        currentTrack.noise / 100  
    );
    // 트랙바에서 받은 색상
    const noiseImage_select = generateNoise(
        200, 
        200,  
        color.red,  
        color.green,  
        color.blue,  
        color.opacity,  
        color.noise / 100  
    );


    const nextTrack = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
        if (audio) {
            audio.pause(); // 현재 재생 중인 트랙 정지
            setAudio(null); // audio 객체 초기화
        }
        setIsPlaying(false);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prevIndex) => 
            prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
        );
        if (audio) {
            audio.pause(); // 현재 재생 중인 트랙 정지
            setAudio(null); // audio 객체 초기화
        }
        setIsPlaying(false);
    };

    // 현재 트랙의 ID를 서버로 전송 후 URL 받아옴
    const PlayMusic = () => {
        const id_data = {
            id: currentTrack.id
        };

        fetch('http://localhost:5000/api/data', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(id_data),
        })
        .then(response => response.json())
        .then(data => {
            //console.log('Success:', data);
            const previewUrl = data.preview_url;
            console.log('Success:', previewUrl);
            if (!previewUrl) {
                alert("이 곡은 30초 미리듣기 기능이 제공되지 않습니다.");
                return; // 미리듣기가 없는 경우 재생 시도를 하지 않음
            }

            if (audio) {
              if (isPlaying) {
                audio.pause();  // 이미 재생 중이라면 정지
                setIsPlaying(false);
              } else {
                audio.play();   // 정지 상태라면 재생
                setIsPlaying(true);
              }
            } else {
              const newAudio = new Audio(previewUrl);
              setAudio(newAudio);
              newAudio.play();
              setIsPlaying(true);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    // 앨범 표지, 버튼 배경색 설정
    const buttonStyle = {
        backgroundColor: `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.opacity / 255})`,
    };

    const albumCoverStyle = {
        backgroundImage: `url(${noiseImage})`,
        backgroundColor: `rgba(${currentTrack.red}, ${currentTrack.green}, ${currentTrack.blue}, ${currentTrack.opacity / 255})`,
        backgroundBlendMode: 'overlay',
    };

    const SelectMusicStyle = {
        backgroundImage: `url(${noiseImage_select})`,
        backgroundSize: 'cover',
    };
    

    return ( 
        <div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={closeModal}>&times;</span>
                        <h2>결과</h2>
                        <div className="select-color" style={SelectMusicStyle}></div>
                        <p>선택하신 색상은</p>
                        <p>{atom} <br></br>느낌의 곡입니다</p>
                        <p>위 결과를 바탕으로 곡 10개를 추천 드리겠습니다!</p>
                        <button className="modal-action-btn" onClick={closeModal}>확인</button>
                        <button className="modal-action-btn" onClick={handleSelectAgain}>다시 선택</button>
                    </div>
                </div>
            )}

            {!isModalOpen && (
                <div>
                    <div className="tags-container">
                        <div className="tags">
                            
                            {highlightedText}
                        </div>
                    </div>
                    <div className='result-container'> 
                        <div className="music-player">
                            <div className="track-info">
                                <div className="album-cover" style={albumCoverStyle}></div>
                                <div className="track-title-container">
                                    <p className="track-title">{currentTrack.name}</p>
                                </div>
                                <div className="artist-name">{artistShow(currentTrack)}</div>
                            </div>
                            <div className="player-controls">
                                <button className="prev-button" onClick={prevTrack} style={buttonStyle}>⟵</button>
                                <button className="next-button" onClick={nextTrack} style={buttonStyle}>⟶</button>
                            </div>
                            <div className="playback-bar">
                                <button className="play-button" onClick={PlayMusic} style={buttonStyle}>
                                    {isPlaying ? '⏸' : '▶'}
                                </button>
                                <div className="progress-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
}

export default Results;
