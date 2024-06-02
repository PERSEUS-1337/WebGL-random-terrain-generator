const timeSlider = document.getElementById('timeSlider');
const timeDisplay = document.getElementById('timeDisplay');

const totalMinutesInADay = 1440;
const skyBlue = [0.8235, 0.9686, 1, 1]; // #D2F7FF RGBA(210, 247, 255, 1)
const darkBlue = [0.0824, 0.1333, 0.2196, 1]; // #152238 RGBA(21, 34, 56, 1)
const skyGradient = [(skyBlue[0]-darkBlue[0])/(totalMinutesInADay/2), (skyBlue[1]-darkBlue[1])/(totalMinutesInADay/2), (skyBlue[2]-darkBlue[2])/(totalMinutesInADay/2)];

let active = false;
let timeRatio = 41.67;
let mins;

function getLightingColorBasedOnTime(timeInMinutes) {
    let r, g, b;
    let angle = (timeInMinutes / totalMinutesInADay) * 2 * Math.PI;  // Convert time to angle in radians

    // Compute the sun's position in the sky
    lightDirection = [-Math.cos(angle - Math.PI / 2), -Math.sin(angle - Math.PI / 2), 0.75, 0.0];

    // Compute sky color depending on time
    if (timeInMinutes <= totalMinutesInADay/2){
        r = timeInMinutes*skyGradient[0]+darkBlue[0];
        g = timeInMinutes*skyGradient[1]+darkBlue[1];
        b = timeInMinutes*skyGradient[2]+darkBlue[2]
    } else {
        r = (totalMinutesInADay-timeInMinutes)*skyGradient[0]+darkBlue[0];
        g = (totalMinutesInADay-timeInMinutes)*skyGradient[1]+darkBlue[1];
        b = (totalMinutesInADay-timeInMinutes)*skyGradient[2]+darkBlue[2];
    }
    skyColor = [r, g, b, 1];

    gl.uniform4fv(uLightDirectionVectorPtr, lightDirection);
    drawScene();
}

timeSlider.addEventListener('input', function() {
    let minutes = parseInt(this.value, 10);
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;

    let formattedTime = `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
    timeDisplay.textContent = formattedTime;

    getLightingColorBasedOnTime(minutes);
});

//day night cycle
async function dayNightCycle() {
    while  (active)  {
        // update minutes in time
        mins = parseInt(timeSlider.value, 10) + 1;
        if (mins > totalMinutesInADay){
            mins -= totalMinutesInADay;
        }
        timeSlider.value = mins;
        timeSlider.dispatchEvent(new Event('input', {bubbles: true, cancelable: true}));

        // This is just to simulate a delay in the loop
        await new Promise(resolve => setTimeout(resolve, timeRatio));
    }
}

// toggle day night cycle
const dayNightCycleButton = document.getElementById('dayNightCycle');
dayNightCycleButton.addEventListener('click', function() {
    active = !active;
    if (active){
        dayNightCycle();
        dayNightCycleButton.textContent = "Stop Day/Night Cycle"
        dayNightCycleButton.classList.remove("btn-primary");
        dayNightCycleButton.classList.add("btn-danger");
    } else {
        dayNightCycleButton.textContent = "Start Day/Night Cycle"
        dayNightCycleButton.classList.remove("btn-danger");
        dayNightCycleButton.classList.add("btn-primary");
    }
});