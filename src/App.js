import React, { useEffect } from 'react';
import './App.css';
import _ from 'lodash';
import { GenerateColors } from './Colors';

const IMAGE_WIDTH = 256;
const IMAGE_HEIGHT = 128;

function App() {

    const pixelWordColors = ['orange', 'red', 'green', 'cornflowerblue', 'blue'];
    const pixelWord = ['i', 'm', 'a', 'g', 'e'].map((char, i) =>
        <span key={i} style={{color: pixelWordColors[i]}}>{char}</span>
    );

    function GetPixelIndex(x, y) {
        return 4 * (x + y * IMAGE_WIDTH);
    }

    function GenerateImage() {

    }

    useEffect(() => {
        const colors = GenerateColors(IMAGE_WIDTH, IMAGE_HEIGHT);

        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext("2d");
        const imgData = ctx.createImageData(IMAGE_WIDTH, IMAGE_HEIGHT);

        const graph = {};
        const sineArcLength = IMAGE_HEIGHT / 32;
        let i = -IMAGE_HEIGHT;
        const MAX_WHILE_LOOPS = IMAGE_HEIGHT * 2;

        let pixelsFilled = 0;
        console.log(`Pixels filled to image: ${pixelsFilled}`);
        console.log(`Iterations: ${i}`);
        console.log(`Colors left: ${colors.length}`);

        while (true) {
            for (let x = 0; x < IMAGE_WIDTH; x ++) {
                const y = Math.round(sineArcLength * Math.sin(0.15*x) + i);

                // Do not process an already processed pixel
                // Also do not process if pixel goes out of image bounds
                if (graph[x] !== undefined && _.includes(graph[x], y) || y >= IMAGE_HEIGHT || y < 0) {
                    //console.log(i, {x:x, y:y});
                    continue;
                }

                if (!Array.isArray(graph[x])) {
                    graph[x] = [y];
                } else {
                    graph[x].push(y);
                }

                const pixelIndex = GetPixelIndex(x, y);
                const color = colors.pop();

                if (!color) {
                    break;
                }

                pixelsFilled++;

                imgData.data[pixelIndex+0] = color.r;
                imgData.data[pixelIndex+1] = color.g;
                imgData.data[pixelIndex+2] = color.b;
                imgData.data[pixelIndex+3] = 255;
            }

            i++;
            if (i > MAX_WHILE_LOOPS || colors.count === 0 || pixelsFilled === IMAGE_WIDTH * IMAGE_HEIGHT) {
                break;
            }
        }
        console.log(`Image processed:`);

        console.log(`Pixels filled to image: ${pixelsFilled}`);
        console.log(`Iterations: ${i}`);
        console.log(`Colors left: ${colors.length}`);

        const red = imgData.data[((127 * (imgData.width * 4)) + (200 * 4))];
        const green = imgData.data[((127 * (imgData.width * 4)) + (200 * 4)) + 1];
        const blue = imgData.data[((127 * (imgData.width * 4)) + (200 * 4)) + 2];

        console.log(red, green, blue);

        ctx.putImageData(imgData, 0, 0);
    });

    return (
        <div className="App">
            <header className="App-header">
            <p>
                Magic {pixelWord} generator
            </p>

            <canvas id="myCanvas" width={IMAGE_WIDTH} height={IMAGE_HEIGHT}
            style={{border: '1px solid #000000'}}
            >
                Your browser does not support the HTML5 canvas tag.</canvas>
            <p>
                <button onClick={GenerateImage}>Generate Image</button>
            </p>

            </header>
        </div>
    );
}

export default App;
