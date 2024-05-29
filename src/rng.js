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
// ### OLD IMPLEMENTATION
function populateMatx(matx, n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i % 10 === 0 && j % 10 === 0) {
        matx[i][j] = getRandomInt(MAX_ELEV);
      }
    }
  }
}
// ### OLD IMPLEMENTATION

// Function to populate matrix with random elevations at random coordinates
function randPopulateMatx(matx, n, coordinates) {
  coordinates.forEach((coord) => {
    matx[coord.x][coord.y] = getRandomInt(MAX_ELEV);
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

// ### OLD IMPLEMENTATION
function terrainInter(matx, n) {
  for (let i = 0; i < n; i++) {
    let min_x = getMin(i);
    let max_x = getMax(i);
    for (let j = 0; j < n; j++) {
      if (!(i % 10 === 0 && j % 10 === 0)) {
        let min_y = getMin(j);
        let max_y = getMax(j);

        let area_d = Math.abs(min_x - i) * Math.abs(min_y - j);
        let area_c = Math.abs(max_x - i) * Math.abs(min_y - j);
        let area_b = Math.abs(min_x - i) * Math.abs(max_y - j);
        let area_a = Math.abs(max_x - i) * Math.abs(max_y - j);

        let elev_a = matx[min_x][min_y];
        let elev_b = matx[max_x][min_y];
        let elev_c = matx[min_x][max_y];
        let elev_d = matx[max_x][max_y];

        let elevation =
          (area_a * elev_a +
            area_b * elev_b +
            area_c * elev_c +
            area_d * elev_d) /
          (area_a + area_b + area_c + area_d);

        matx[i][j] = elevation;
      }
    }
  }

  // Handle axis-aligned points (either i or j is a multiple of 10, but not both)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if ((i % 10 === 0 || j % 10 === 0) && !(i % 10 === 0 && j % 10 === 0)) {
        if (i % 10 === 0) {
          // Vertical axis point
          let min_y = getMin(j);
          let max_y = getMax(j);

          let distance_y = max_y - min_y;
          let distance_to_min_y = j - min_y;
          let distance_to_max_y = max_y - j;

          let weight_min = distance_to_max_y / distance_y;
          let weight_max = distance_to_min_y / distance_y;

          matx[i][j] =
            weight_min * matx[i][min_y] + weight_max * matx[i][max_y];
        } else if (j % 10 === 0) {
          // Horizontal axis point
          let min_x = getMin(i);
          let max_x = getMax(i);

          let distance_x = max_x - min_x;
          let distance_to_min_x = i - min_x;
          let distance_to_max_x = max_x - i;

          let weight_min = distance_to_max_x / distance_x;
          let weight_max = distance_to_min_x / distance_x;

          matx[i][j] =
            weight_min * matx[min_x][j] + weight_max * matx[max_x][j];
        }
      }
    }
  }
}
// ### OLD IMPLEMENTATION

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
let N = 101;
let MAX_ELEV = 25;
let ANCHOR_PERCENT = 0.01;
let anchorCount = Math.floor(N * N * ANCHOR_PERCENT);
let randomCoordinates = getRandomCoordinates(N, anchorCount);

// Initialize the matrices
let matx = Array.from({ length: N }, () => Array(N).fill(0));
let randMatx = Array.from({ length: N }, () => Array(N).fill(0));

// Functions to populate and interpolate the matrices
populateMatx(matx, N);
terrainInter(matx, N);
randPopulateMatx(randMatx, N, randomCoordinates);
randTerrainInter(randMatx, N, randomCoordinates);

// Function to display the matrix
document.addEventListener("DOMContentLoaded", () => {
  let currentMatrixType = "randMatx"; // Variable to track the currently displayed matrix type

  // Display the initial matrix
  displayMatrix(randMatx);

  // Event listener for the regenerate button
  document.getElementById("regenerate-button").addEventListener("click", () => {
    N = parseInt(document.getElementById("matrix-size").value);
    MAX_ELEV = parseInt(document.getElementById("max-elevation").value);
    ANCHOR_PERCENT = parseFloat(
      document.getElementById("anchor-percent").value
    );

    anchorCount = Math.floor(N * N * ANCHOR_PERCENT);
    randomCoordinates = getRandomCoordinates(N, anchorCount);

    matx = Array.from({ length: N }, () => Array(N).fill(0));
    randMatx = Array.from({ length: N }, () => Array(N).fill(0));

    populateMatx(matx, N);
    terrainInter(matx, N);
    randPopulateMatx(randMatx, N, randomCoordinates);
    randTerrainInter(randMatx, N, randomCoordinates);

    // Display the matrix based on the currentMatrixType
    if (currentMatrixType === "randMatx") {
      displayMatrix(randMatx);
    } else {
      displayMatrix(matx);
    }
  });

  // Event listener for the toggle button
  document.getElementById("toggle-button").addEventListener("click", () => {
    const container = document.getElementById("matrix-container");
    if (currentMatrixType === "randMatx") {
      displayMatrix(matx);
      container.dataset.display = "matx";
      currentMatrixType = "matx"; // Update the current matrix type
    } else {
      displayMatrix(randMatx);
      container.dataset.display = "randMatx";
      currentMatrixType = "randMatx"; // Update the current matrix type
    }
  });
});
