const timeSlider = document.getElementById('timeSlider');
const timeDisplay = document.getElementById('timeDisplay');

function getLightingColorBasedOnTime(timeInMinutes) {
    const totalMinutesInADay = 1440;
    const lightDistMult = 10;
    const angle = (timeInMinutes / totalMinutesInADay) * 2 * Math.PI;  // Convert time to angle in radians

    // Compute the sun's position in the sky
    lightDirection = [-Math.cos(angle - Math.PI / 2)*lightDistMult, -Math.sin(angle - Math.PI / 2)*lightDistMult, 0.75, 0.0];
    console.log(lightDirection)

    // if (timeInMinutes >= 360 && timeInMinutes < 1080) {
    //     // Daytime lighting
    //     lightAmbient = [0.25, 0.25, 0.25, 1.0];
    //     lightDiffuseColor = [1.0, 1.0, 1.0, 1.0];
    // } else {
    //     // Nighttime lighting
    //     lightAmbient = [0.1, 0.1, 0.1, 1.0];
    //     lightDiffuseColor = [0.5, 0.5, 0.7, 1.0];
    // }

    // gl.uniform4fv(uLightDiffuseColorPtr, lightDiffuseColor);
    // gl.uniform4fv(uAmbientLightPtr, lightAmbient);
    gl.uniform4fv(uLightDirectionVectorPtr, lightDirection);

    drawScene();

    // return { ambientLight, directionalLightColor, directionalVector };
}

timeSlider.addEventListener('input', function() {
    let minutes = parseInt(this.value, 10);
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;

    let formattedTime = `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
    timeDisplay.textContent = formattedTime;

    getLightingColorBasedOnTime(minutes);
});