// Function to display the matrix on the web page
function displayMatrix(matrix) {
  const container = document.getElementById("matrix-container");
  container.innerHTML = ""; // Clear previous content
  const table = document.createElement("table");

  // Create table rows
  for (let i = 0; i < matrix.length; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < matrix[i].length; j++) {
      const cell = document.createElement("td");
      const cellData = matrix[i][j];
      cell.style.backgroundColor = `rgb(${Math.floor(
        (cellData / MAX_ELEV) * 255
      )}, ${Math.floor((cellData / MAX_ELEV) * 255)}, ${Math.floor(
        (cellData / MAX_ELEV) * 255
      )})`;
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  container.appendChild(table);
  console.log(matrix);
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getMin(index) {
  return Math.floor(index / 10) * 10;
}

function getMax(index) {
  return Math.ceil(index / 10) * 10;
}

function getRandomCoordinates(n, count) {
  let coordinates = [];
  while (coordinates.length < count) {
    let x = getRandomInt(n);
    let y = getRandomInt(n);
    let key = `${x},${y}`;
    if (!coordinates.some((coord) => coord.key === key)) {
      coordinates.push({ x, y, key });
    }
  }
  return coordinates;
}

// Function to populate matrix with random elevations at random coordinates
function randPopulateMatx(matx, coordinates, max) {
  coordinates.forEach((coord) => {
    matx[coord.x][coord.y] = getRandomInt(max);
  });
}

// Function to find the four closest anchor points for interpolation
function findClosestAnchors(i, j, anchors) {
  let sortedAnchors = anchors
    .map((anchor) => ({
      ...anchor,
      distance: Math.abs(anchor.x - i) + Math.abs(anchor.y - j),
    }))
    .sort((a, b) => a.distance - b.distance);

  return sortedAnchors.slice(0, 4);
}

// Function to interpolate terrain based on random anchors
function randTerrainInter(matx, n, anchors) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matx[i][j] === 0) {
        // Only interpolate uninitialized points
        let closestAnchors = findClosestAnchors(i, j, anchors);
        let totalWeight = 0;
        let weightedElevation = 0;

        closestAnchors.forEach((anchor) => {
          let distance = Math.abs(anchor.x - i) + Math.abs(anchor.y - j);
          let weight = 1 / (distance + 1); // Adding 1 to avoid division by zero
          totalWeight += weight;
          weightedElevation += matx[anchor.x][anchor.y] * weight;
        });

        matx[i][j] = weightedElevation / totalWeight;
      }
    }
  }
}

// ### END OF FUNCTION DECLARATIONS

// Define default values for the matrix
let N = 75;
let MAX_ELEV = 25;
let ANCHOR_PERCENT = 0.01;

// Function to display the matrix
document.addEventListener("DOMContentLoaded", () => {
  
  // Initialize the matrices
  let anchorCount = Math.floor(N * N * ANCHOR_PERCENT);
  let randomCoordinates = getRandomCoordinates(N, anchorCount);
  let randMatx = Array.from({ length: N }, () => Array(N).fill(0));
  randPopulateMatx(randMatx, randomCoordinates, MAX_ELEV);
  randTerrainInter(randMatx, N, randomCoordinates);

  // Display the initial matrix
  displayMatrix(randMatx);

  // Event listener for the regenerate button
  document.getElementById("regenerate-button").addEventListener("click", () => {
    // Fetch new values for the matrix
    N = parseInt(document.getElementById("matrix-size").value);
    MAX_ELEV = parseInt(document.getElementById("max-elevation").value);
    ANCHOR_PERCENT = parseFloat(
      document.getElementById("anchor-percent").value
    );

    // Reinitialize the matrices
    anchorCount = Math.floor(N * N * ANCHOR_PERCENT);
    randomCoordinates = getRandomCoordinates(N, anchorCount);
    randMatx = Array.from({ length: N }, () => Array(N).fill(0));
    randPopulateMatx(randMatx, randomCoordinates, MAX_ELEV);
    randTerrainInter(randMatx, N, randomCoordinates);

    displayMatrix(randMatx)
  });
});
