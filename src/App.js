import React, { useState, useEffect } from 'react';
import './App.css';
import _ from 'lodash';
import { generateColors } from './Colors';

/*
    CONSTANTS
*/
const IMAGE_WIDTH = 256;
const IMAGE_HEIGHT = 128;
const PREVIEW_WIDTH = 32;
const PREVIEW_HEIGHT = 32;

function App() {

    /*
        React state declarations
    */
    const [pixelCoordX, setPixelCoordX] = useState(0);
    const [pixelCoordY, setPixelCoordY] = useState(0);
    const [previewPixel, setPreviewPixel ] = useState([0, 0, 0]);

    function getPixelIndex(x, y) {
        /*
            getPixelIndex

            Get's the pixel's data index based on x, y coordinates.

            Referenced from:
            http://tutorials.jenkov.com/html5-canvas/pixels.html#manipulating-the-pixels
        */
        return 4 * (x + y * IMAGE_WIDTH);
    }

    function getColorOfPixel(x, y) {
        const imageCanvas = document.getElementById('imageCanvas');
        const previewCanvas = document.getElementById('pixelColorPreview');

        const imageCanvasContext = imageCanvas.getContext("2d");

        if (x === undefined || y === undefined) {
            return;
        }

        const pixel = imageCanvasContext.getImageData(x, y, 1, 1);
        const data = pixel.data;
        const [r, g, b, a] = data;
        setPreviewPixel(data);

        const previewCanvasContext = previewCanvas.getContext("2d");
        const imgData = previewCanvasContext.getImageData(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);

        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i+0] = r;
            imgData.data[i+1] = g;
            imgData.data[i+2] = b;
            imgData.data[i+3] = a;
        }

        previewCanvasContext.putImageData(imgData, 0, 0);
    }

    function PickColor(event) {
        const x = event.layerX;
        const y = event.layerY;
        setPixelCoordX(x);
        setPixelCoordY(y);
        getColorOfPixel(x, y);
    }

    function generateImage() {
        // Generate 32,768 discrete colours to be used in our image.
        const colors = generateColors(IMAGE_WIDTH, IMAGE_HEIGHT);

        const canvas = document.getElementById('imageCanvas');
        const context = canvas.getContext("2d");
        const imgData = context.createImageData(IMAGE_WIDTH, IMAGE_HEIGHT);

        // Listens to mouse move to preview the color of the pixel on the position
        // of the cursor
        canvas.addEventListener('mousemove', (e) => PickColor(e, context));

        const graph = {};
        const sineArcLength = IMAGE_HEIGHT / 32;
        const MAX_WHILE_LOOPS = IMAGE_HEIGHT * 2;

        let i = -sineArcLength;
        let pixelsFilled = 0;

        console.log(`Pixels filled to image: ${pixelsFilled}`);
        console.log(`Iterations: ${i+sineArcLength}`);
        console.log(`Colors left: ${colors.length}`);

        // Iterate over the x axis, apply a sine function, and then increment
        // the y values using an iterator i
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

                const pixelIndex = getPixelIndex(x, y);
                const color = colors.pop();

                pixelsFilled++;

                imgData.data[pixelIndex+0] = color.r;
                imgData.data[pixelIndex+1] = color.g;
                imgData.data[pixelIndex+2] = color.b;
                imgData.data[pixelIndex+3] = 255;
            }

            i++;

            // Break the while loop when there are no more colors to add,
            // or the entire image has been filled, or as a safety net, if
            // for some reasons the 2 above conditions do not fire and we go into an infinite loop.
            if (i > MAX_WHILE_LOOPS || colors.count === 0 || pixelsFilled === IMAGE_WIDTH * IMAGE_HEIGHT) {
                break;
            }
        }

        context.putImageData(imgData, 0, 0);

        console.log(`Image processed:`);
        console.log(`Pixels filled to image: ${pixelsFilled}`);
        console.log(`Iterations: ${i+sineArcLength}`);
        console.log(`Colors left: ${colors.length}`);
    }

    // Generate the image once after the component mounts for the first time
    useEffect(() => {
        generateImage();
    }, []);

    // Render a word with fancy colors
    const rainbowWordColors = ['orange', 'red', 'green', 'cornflowerblue', 'blue'];
    const rainbowWord = ['i', 'm', 'a', 'g', 'e'].map((char, i) =>
        <span key={i} style={{color: rainbowWordColors[i]}}>{char}</span>
    );

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Magic {rainbowWord} generator
                </p>
            </header>

            <canvas id="imageCanvas" width={IMAGE_WIDTH} height={IMAGE_HEIGHT}
            style={{border: '1px solid #000000'}}>
                Your browser does not support the HTML5 canvas tag.
            </canvas>

            <p>
                You can check the color of each pixel by hovering the mouse over the image above,
            </p>
            <p>
                or by filling in the (x, y) coordinates of the desired pixel here:
            </p>

            <p>
                (x: <input type="number" onChange={(e) => setPixelCoordX(e.target.value)}
                     min={0} max={IMAGE_WIDTH - 1} value={pixelCoordX} />,
                y: <input type="number" onChange={(e) => setPixelCoordY(e.target.value)}
                     min={0} max={IMAGE_HEIGHT - 1} value={pixelCoordY} />)
            </p>

            <p>
                <button onClick={() => getColorOfPixel(pixelCoordX, pixelCoordY)}>Get color of pixel</button>
            </p>

            <canvas id="pixelColorPreview" width={PREVIEW_WIDTH} height={PREVIEW_HEIGHT}
            style={{border: '1px solid #000000'}}>
                Your browser does not support the HTML5 canvas tag.
            </canvas>

            <p>
                r: {previewPixel[0]}
            </p>
            <p>
                g: {previewPixel[1]}
            </p>
            <p>
                b: {previewPixel[2]}
            </p>

        </div>
    );
}

export default App;
