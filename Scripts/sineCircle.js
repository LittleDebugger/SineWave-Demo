// js file for SineCircle.html

// Variable assignments.
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    stopStart = document.getElementById("stopStart"),
    waveGenerator = com.littleDebugger.daw.dsp.generator.sineWave;

var yCenter = canvas.height / 2,
    xCenter = 100,
    xStartOfWave = 300,
    radius = 99,
    freq = 50,
    sampleRate = 10000,
    waveSamples = [],
    running = false,
    setInt;

// Get wave generator instances.
var sineWaveGeneratorInstance = waveGenerator(0, sampleRate);
var cosineWaveGeneratorInstance = waveGenerator(90, sampleRate);

// Redraw circle
var drawCircle = function () {
    ctx.beginPath();
    ctx.arc(xCenter, yCenter, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.stroke();
};

var updateScreen = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Get sine and cosine graphs at 1 cycle per sample rate.
    var x = xCenter + (cosineWaveGeneratorInstance.getSample(freq) * radius),
        // Subtraction because the 0, 0 on the canvas is top left.
        y = yCenter - (sineWaveGeneratorInstance.getSample(freq) * radius);

    if (waveSamples.length > canvas.width - xStartOfWave) {
        // Remove the last sample from wave sample if it is pushed off the canvas.
        waveSamples.shift();
    }

    // Add the new sample to wave sample array.
    waveSamples.push(y);

    drawCircle();

    // Redraw wave.
    ctx.beginPath();
    waveSamples.forEach(function (waveSample, i) {
        ctx.lineTo(xStartOfWave - i + waveSamples.length, waveSample);
    });

    ctx.stroke();

    // draw radius in circle and line to sine wave
    ctx.beginPath();
    ctx.moveTo(xCenter, yCenter);
    ctx.lineTo(x, y);
    ctx.lineTo(xStartOfWave + 1, y);
    ctx.stroke();
};

// Wire up stop/start button.
stopStart.onclick = function() {
    if (!running) {
        running = true;
        stopStart.value = "Stop";
        setInt = window.setInterval(updateScreen, 1000 / 23);
    } else {
        running = false;
        stopStart.value = "Start";
        clearInterval(setInt);
    }
};

drawCircle();