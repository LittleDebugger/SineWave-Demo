// js file for Ripple.html

// Assign variables.
var running = true,
    setInt,
    container = document.getElementById("container"),
    canvas = document.getElementById("canvas"),
    points = document.getElementById("points"),
    angle = document.getElementById("angle"),
    stopStart = document.getElementById("stopStart"),
    ctx = canvas.getContext("2d");

// Click canvas enters full screen.
com.littleDebugger.ui.fullScreenEvent(container, canvas);

// Ripple class.
// Instances contain state of a single ripple.
// <sin> 
var Ripple = function (sineWaveGeneratorInstance) {
    this.sineWaveGeneratorInstance = sineWaveGeneratorInstance;
    this.radius = 0;
};

var yCenter = canvas.height / 2;
var xCenter = canvas.width / 2;
var depth = 20;
var visibleWaves = 1;
var maxVisibleWaves = 18;
var spawnFrequency = 18;
var speed = 22;
var ripples = [];
var respawnCount = 0;
var growthSpeed = 3;
var waveGenerator = com.littleDebugger.daw.dsp.generator.sineWave;

// Add the first ripple to array;
ripples.push(new Ripple(waveGenerator(0, speed)));

// Draw a single ripple
// <ripple> The ripple to draw.
var drawRipple = function(ripple) {
    // Get wave generators at the same sample rate as n points for the ripple shapes.
    // This means n getSample calls will be 1 full cycle.
    var drawSin = waveGenerator(0, points.value),
        drawCos = waveGenerator(90, points.value),
        height = ripple.sineWaveGeneratorInstance.getSample(1) * (depth - (depth / angle.value)),
        radius = ripple.radius;

    ctx.beginPath();

    // Draw line to each point on ripple shape.
    var lineTo = function() {
        var x = xCenter + drawSin.getSample(1) * radius;
        var y = yCenter + height + drawCos.getSample(1) * (radius / angle.value);
        ctx.lineTo(x, y);
    };

    for (var i = 0; i < points.value; i++) {
        lineTo();
    }

    lineTo();
    ctx.stroke();
};

// Update canvas.
var updateCanvas = function () {
    respawnCount++;

    // Periodically add new ripple.
    if (respawnCount > spawnFrequency) {
        if (visibleWaves < maxVisibleWaves) {
            visibleWaves++;
        } else {
            ripples.shift();
        }

        ripples.push(new Ripple(waveGenerator(0, speed)));
        respawnCount = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all ripples.
    ripples.forEach(function (ripple) {
        ripple.radius += growthSpeed;
        drawRipple(ripple);
    });
};

// Start annimation.
window.onload = function() {
    // set timer to update screen
    setInt = window.setInterval(updateCanvas, 1000 / 24);
};

// Wire up start/stop button.
stopStart.onclick = function() {
    if (running) {
        running = false;
        stopStart.value = "Start";
        clearInterval(setInt);
    } else {
        running = true;
        stopStart.value = "Stop";
        window.onload();
    }
};