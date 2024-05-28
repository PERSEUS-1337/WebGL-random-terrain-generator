let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let direction = vec3.subtract([], eyePoint, lookAtPoint /*, eyePoint*/);
vec3.normalize(direction, direction);
let yaw = Math.atan2(direction[0], direction[2]);   // Horizontal rotation
// let pitch = Math.asin(direction[1]); // Vertical rotation
let pitch = Math.atan2(direction[1], direction[2]); // Vertical rotation
console.log(yaw, pitch)

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

    let deltaX = event.clientX - previousMousePosition.x;
    let deltaY = event.clientY - previousMousePosition.y;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;

    // Update yaw and pitch based on mouse movement
    yaw += deltaX * 0.01; // Adjust sensitivity as needed
    pitch += deltaY * 0.01; // Adjust sensitivity as needed

    // Clamp pitch to avoid flipping
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    updateCamera();
});

// function calculateDirection(yaw, pitch) {
//     return [
//         Math.cos(pitch) * Math.sin(yaw),
//         Math.sin(pitch),
//         Math.cos(pitch) * Math.cos(yaw)
//     ];
// }

// function calculateRightVector(direction) {
//     return [
//         Math.sin(direction - Math.PI / 2.0),
//         0,
//         Math.cos(direction - Math.PI / 2.0)
//     ];
// }

// function calculateUpVector(direction, right) {
//     return vec3.cross([], right, direction);
// }

function updateCamera() {
    // Calculate the new camera direction based on yaw and pitch
    // let direction = [
    //     Math.cos(pitch) * Math.sin(yaw),
    //     Math.sin(pitch),
    //     Math.cos(pitch) * Math.cos(yaw)
    // ];

    // let direction = calculateDirection(yaw, pitch);
    // let right = calculateRightVector(direction);
    // let up = calculateUpVector(direction, right);

    // Recalculate the camera target
    // let newTarget = [
    //     eyePoint[0] + direction[0],
    //     eyePoint[1] + direction[1],
    //     eyePoint[2] + direction[2]
    // ];

    console.log(yaw, pitch)
    // console.log(viewMatrix);

    // Update the view matrix (assuming you have a utility function for this)
    // viewMatrix = mat4.lookAt(mat4.create(), eyePoint, newTarget, upVector);

    let viewMatrix = mat4.create();
    mat4.rotateX(viewMatrix, viewMatrix, pitch);
    mat4.rotateY(viewMatrix, viewMatrix, yaw);
    mat4.translate(viewMatrix, viewMatrix, [-eyePoint[0], -eyePoint[1], -eyePoint[2]]);

    // Use the view matrix in your shader program
    gl.uniformMatrix4fv(uViewMatrixPointer, false, viewMatrix);

    // Render the scene with the new camera settings
    drawScene();
}