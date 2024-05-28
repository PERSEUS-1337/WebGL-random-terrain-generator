const dragSens = 0.01;
const panSpeed = 1;

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let keysPressed = {};

let direction = vec3.subtract([], eyePoint, lookAtPoint);
vec3.normalize(direction, direction);
let yaw = Math.atan2(direction[0], direction[2]);   // Horizontal rotation
let pitch = Math.asin(direction[1]); // Vertical rotation

canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    let deltaX = -(event.clientX - previousMousePosition.x);
    let deltaY = event.clientY - previousMousePosition.y;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;

    // Update yaw and pitch based on mouse movement
    yaw += deltaX * dragSens;
    pitch += deltaY * dragSens;

    // Clamp pitch to avoid flipping
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    let r = Math.sqrt(Math.pow(eyePoint[0]-lookAtPoint[0], 2) + Math.pow(eyePoint[1]-lookAtPoint[1], 2) + Math.pow(eyePoint[2]-lookAtPoint[2], 2))
    eyePoint = [
        r * Math.cos(pitch) * Math.sin(yaw) + lookAtPoint[0],
        r * Math.sin(pitch) + lookAtPoint[1],
        r * Math.cos(pitch) * Math.cos(yaw) + lookAtPoint[2]
    ]

    updateCamera();
});

// Keyboard event listeners
window.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    panCamera();
});

window.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

function panCamera() {
    if (keysPressed['w']) {
        eyePoint[2] -= panSpeed * Math.cos(yaw);
        eyePoint[0] -= panSpeed * Math.sin(yaw);

        lookAtPoint[2] -= panSpeed * Math.cos(yaw);
        lookAtPoint[0] -= panSpeed * Math.sin(yaw);
    }
    if (keysPressed['s']) {
        eyePoint[2] += panSpeed * Math.cos(yaw);
        eyePoint[0] += panSpeed * Math.sin(yaw);

        lookAtPoint[2] += panSpeed * Math.cos(yaw);
        lookAtPoint[0] += panSpeed * Math.sin(yaw);
    }
    if (keysPressed['a']) {
        eyePoint[2] += panSpeed * Math.sin(yaw);
        eyePoint[0] -= panSpeed * Math.cos(yaw);

        lookAtPoint[2] += panSpeed * Math.sin(yaw);
        lookAtPoint[0] -= panSpeed * Math.cos(yaw);
    }
    if (keysPressed['d']) {
        eyePoint[2] -= panSpeed * Math.sin(yaw);
        eyePoint[0] += panSpeed * Math.cos(yaw);

        lookAtPoint[2] -= panSpeed * Math.sin(yaw);
        lookAtPoint[0] += panSpeed * Math.cos(yaw);
    }

    console.log(eyePoint[0], eyePoint[2])
    updateCamera();
}

// Update the view matrix
function updateCamera() {    
    viewMatrix = mat4.lookAt(mat4.create(), eyePoint, lookAtPoint, upVector);
    gl.uniformMatrix4fv(uViewMatrixPointer, false, viewMatrix);
    drawScene();
}