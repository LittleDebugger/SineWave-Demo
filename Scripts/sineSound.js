// js file for SineSound.html
var start = document.getElementById("start");
var stop = document.getElementById("stop");

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var oscillator;
var showWarning = true;

// Mainly pillaged from https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
start.onclick = function () {
    if (showWarning) {
        showWarning = false;
        alert("Please set your speaker volume to an appropriate level.");
    }

    oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 440;
    oscillator.connect(audioCtx.destination);
    oscillator.start();
};
stop.onclick = function () {
    oscillator.stop();
};