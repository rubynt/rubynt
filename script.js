// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#events
const pb = document.getElementById('buttons');
const range = document.querySelector(".volume input[type=range]");
const barHoverBox = document.querySelector(".volume .bar-hoverbox");
const fill = document.querySelector(".volume .bar .bar-fill");
let m = new Audio('http://localhost:8000/stream.flac');
let vol = 0.3;
m.autoplay = true;
let barStillDown = false;
const states = {start:	0,
                stop:	1,
                waiting:2,
	       }
state = states.start;

const start = () => {
    m.volume = vol;
    m.load();
    m.play();
    document.getElementById(Object.keys(states)[state]).setAttribute('display','none');
    document.getElementById('stop').setAttribute('display','flex');
    setTimeout( () => {state = states.stop;}, 100);
}

const stop = () => {
    m.pause();
    document.getElementById(Object.keys(states)[state]).setAttribute('display','none');
    document.getElementById('start').setAttribute('display','flex');
    state = states.start;
}


const waiting = () => {
    m.pause();
    document.getElementById(Object.keys(states)[state]).setAttribute('display','none');
    document.getElementById('waiting').setAttribute('display','flex');
    state = states.waiting;
}

m.addEventListener('waiting', (event) => {
    if (state == states.stop) {
	console.log('waiting');
	waiting();
    }
});

m.addEventListener('canplaythrough', (event) => {
    if (state == states.waiting) {
	console.log('canplaythrough activated');
	start();
    }
});

pb.addEventListener('click', event => {
    if (m.paused) {
	start();
    } else {
	stop();
    }
});

const setValue = (value) => {
    fill.style.width = value + "%";
    vol = value/100;
    range.setAttribute("value", vol)
    m.volume = vol;
}

setValue(range.value);

const calculateFill = (e) => {
    let offsetX = e.offsetX
    if (e.type === "touchmove") {
	offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft
    }
    // first we delete both left and right padding
    const width = e.target.offsetWidth - 20;
    // second we delete only the left one to get the cursor position 
    setValue(Math.max(Math.min((offsetX - 10) / width * 100.0,100.0),0));
}

barHoverBox.addEventListener("touchstart", (e) => {
    barStillDown = true;

    calculateFill(e);
}, true);

barHoverBox.addEventListener("touchmove", (e) => {
    if (barStillDown) {
	calculateFill(e);
    }
}, true);

barHoverBox.addEventListener("mousedown", (e) => {
    barStillDown = true;
    
    calculateFill(e);
}, true);

barHoverBox.addEventListener("mousemove", (e) => {
    if (barStillDown) {
	calculateFill(e);
    }
});

document.addEventListener("mouseup", (e) => {
    barStillDown = false;
}, true);

document.addEventListener("touchend", (e) => {
    barStillDown = false;
}, true);
