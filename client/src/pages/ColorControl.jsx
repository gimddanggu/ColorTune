import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ColorControl.css';

export const generateNoise = (width, height, r, g, b, opacity, noiseLevel) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const imageData = ctx.createImageData(width, height);
    const buffer32 = new Uint32Array(imageData.data.buffer);

    for (let i = 0; i < buffer32.length; i++) {
        if (Math.random() < noiseLevel) {
            const offsetR = Math.random() < 0.5 ? -30 : 30;
            const offsetG = Math.random() < 0.5 ? -30 : 30;
            const offsetB = Math.random() < 0.5 ? -30 : 30;

            const noiseR = Math.min(255, Math.max(0, r + offsetR));
            const noiseG = Math.min(255, Math.max(0, g + offsetG));
            const noiseB = Math.min(255, Math.max(0, b + offsetB));

            // 노이즈 색상에 opacity 적용
            buffer32[i] = ((Math.floor(opacity) & 0xff) << 24) | (noiseB << 16) | (noiseG << 8) | noiseR;
        } else {
            // 기본 배경색에 opacity 적용
            buffer32[i] = ((Math.floor(opacity) & 0xff) << 24) | (b << 16) | (g << 8) | r;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
};

function ColorControl() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [red, setRed] = useState(86);
    const [green, setGreen] = useState(154);
    const [blue, setBlue] = useState(83);
    const [opacity, setOpacity] = useState(255);
    const [noise, setNoise] = useState(50);

    const navigate = useNavigate();

    const updateColorBox = () => {
      // console.log(red, green, blue, opacity)
        return `rgba(${red}, ${green}, ${blue}, ${opacity / 255})`;
    };



    const noiseImage = generateNoise(200, 200, red, green, blue, opacity, noise / 100);

    const handleSubmit = () => {
        const data = {
            red: red,
            green: green,
            blue: blue,
            opacity: opacity,
            noise: noise
        };
        
        console.log('Sending data:', data);

        fetch('http://127.0.0.1:5000/find_tracks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            navigate('/results', { state: { tracks: data.tracks,
                                            color: {
                                                red: red,
                                                green: green,
                                                blue: blue,
                                                opacity: opacity,
                                                noise:noise,
                                            },
                                            atom: data.atom // 트랙바에서 선택한 범위의 분위기
                                            
             } });  // 결과 페이지로 이동하면서 데이터 전달
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    return (
        <div>
            <div className='Modal-explain'>
                <button class="help-button" onClick={openModal}>❔</button>
                <div id="modal-box" className={isModalOpen ? 'active' : ''}>
                    <div className="modal-contents">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>각 특징 설명</h2>
                        <div className="desc">
                            <p><b>R</b>: 곡의 활발함과 역동성을 나타냅니다.</p>
                            <p><b>G</b>: 곡의 어쿠스틱한 정도를 나타냅니다.</p>
                            <p><b>B</b>: 곡의 리듬과 비트를 나타냅니다.</p>
                            <p><b>Opacity</b>: 곡의 인기도를 나타냅니다.</p>
                            <p><b>Noise</b>: 곡 발매 년도를 나타냅니다.(0 ~ 100)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
            <div className="control">
                <label htmlFor="red">R</label>
                <input
                    type="range"
                    id="red"
                    min="0"
                    max="255"
                    value={red}
                    onChange={(e) => setRed(Number(e.target.value))}
                />
                <input
                    type="number"
                    id="redValue"
                    min="0"
                    max="255"
                    value={red}
                    onChange={(e) => setRed(Number(e.target.value))}
                />
            </div>
            <div className="control">
                <label htmlFor="green">G</label>
                <input
                    type="range"
                    id="green"
                    min="0"
                    max="255"
                    value={green}
                    onChange={(e) => setGreen(Number(e.target.value))}
                />
                <input
                    type="number"
                    id="greenValue"
                    min="0"
                    max="255"
                    value={green}
                    onChange={(e) => setGreen(Number(e.target.value))}
                />
            </div>
            <div className="control">
                <label htmlFor="blue">B</label>
                <input
                    type="range"
                    id="blue"
                    min="0"
                    max="255"
                    value={blue}
                    onChange={(e) => setBlue(Number(e.target.value))}
                />
                <input
                    type="number"
                    id="blueValue"
                    min="0"
                    max="255"
                    value={blue}
                    onChange={(e) => setBlue(Number(e.target.value))}
                />
            </div>
            <div className="control">
                <label htmlFor="opacity">Opacity</label>
                <input
                    type="range"
                    id="opacity"
                    min="0"
                    max="255"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                />
                <input
                    type="number"
                    id="opacityValue"
                    min="0"
                    max="255"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                />
            </div>
            <div className="control">
                <label htmlFor="noise">Noise</label>
                <input
                    type="range"
                    id="noise"
                    min="0"
                    max="100"
                    value={noise}
                    onChange={(e) => setNoise(Number(e.target.value))}
                />
                <input
                    type="number"
                    id="noiseValue"
                    min="0"
                    max="100"
                    value={noise}
                    onChange={(e) => setNoise(Number(e.target.value))}
                />
            </div>
            <div
                className="color-box"
                style={{ backgroundColor: updateColorBox(),
                    backgroundImage: `url(${noiseImage})`
                 }}
            ></div>
            <button id="submitButton" onClick={handleSubmit}>찾기</button>
            </div>
        </div>
        
    );
}

export default ColorControl;
