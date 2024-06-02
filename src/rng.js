// Function to display the matrix on the web page
function displayMatrix(matrix, max_elev) {
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
        (cellData / max_elev) * 255
      )}, ${Math.floor((cellData / max_elev) * 255)}, ${Math.floor(
        (cellData / max_elev) * 255
      )})`;
      cell.textContent = cellData.toFixed(2); // Display the data inside the cell
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  container.appendChild(table);
  console.log(matrix);
}

function getRandomFloat(max) {
  return Math.random() * max;
}

function getRandomFloatInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomCoordinates(n, count, min, max) {
  let coordinates = [];
  while (coordinates.length < count) {
    let x = getRandomInt(n);
    let y = getRandomInt(n);
    let elevation = getRandomFloatInRange(min, max);
    let key = `${x},${y}`;
    if (!coordinates.some((coord) => coord.key === key)) {
      coordinates.push({ x, y, elevation, key });
    }
  }
  return coordinates;
}




// Function to populate matrix with elevations at the specified coordinates
function populateMatx(matx, coordinates) {
  coordinates.forEach((coord) => {
    matx[coord.x][coord.y] = coord.elevation;
  });
}

// Function to find the four closest anchor points for interpolation
function findClosestAnchors(i, j, anchors, count) {
  let sortedAnchors = anchors
    .map((anchor) => ({
      ...anchor,
      distance: Math.sqrt(Math.pow(anchor.x - i, 2) + Math.pow(anchor.y - j, 2)),
    }))
    .sort((a, b) => a.distance - b.distance);

  return sortedAnchors.slice(0, count);
}

function terrainInter(matx, n, anchors, count) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matx[i][j] === 0) {
        // Only interpolate uninitialized points
        let closestAnchors = findClosestAnchors(i, j, anchors, count);
        let totalWeight = 0;
        let weightedElevation = 0;
        let p = 2; // Power parameter for the weighting function, can be adjusted

        closestAnchors.forEach((anchor) => {
          let distance = Math.sqrt(Math.pow(anchor.x - i, 2) + Math.pow(anchor.y - j, 2));
          if (distance === 0) {
            weightedElevation = matx[anchor.x][anchor.y];
            totalWeight = 1;
            return false; // Exit the loop
          } else {
            let weight = 1 / Math.pow(distance, p);
            totalWeight += weight;
            weightedElevation += matx[anchor.x][anchor.y] * weight;
          }
        });

        if (totalWeight > 0) {
          matx[i][j] = weightedElevation / totalWeight;
        }
      }
    }
  }
}

// ### END OF FUNCTION DECLARATIONS

// Define default values for the matrix
let N = 50;
let MAX_ELEV = 25;
let MIN_ELEV = 0;
let ANCHOR_PERCENT = 0.01;
let CLOSEST_ANCHOR_COUNT = 4;

// Function to display the matrix in the rng_test.html
document.addEventListener("DOMContentLoaded", () => {
  // Extract Values from HTML
  N = parseInt(document.getElementById("matrix-size").value);
  MAX_ELEV = parseInt(document.getElementById("max-elevation").value);
  MIN_ELEV = parseInt(document.getElementById("min-elevation").value);
  ANCHOR_PERCENT = parseFloat(document.getElementById("anchor-percent").value);
  CLOSEST_ANCHOR_COUNT = parseFloat(
    document.getElementById("closest-anchor-count").value
  );

  // Initialize the matrices
  let anchorCount = Math.floor(N * N * ANCHOR_PERCENT);
  let randomCoordinates = getRandomCoordinates(N, anchorCount, MIN_ELEV, MAX_ELEV);
  let randMatx = Array.from({ length: N }, () => Array(N).fill(0));
  populateMatx(randMatx, randomCoordinates);
  terrainInter(randMatx, N, randomCoordinates, CLOSEST_ANCHOR_COUNT);

  displayMatrix(randMatx, MAX_ELEV);

  // Event listener for the regenerate button
  document.getElementById("regenerate-button").addEventListener("click", () => {
    // Fetch new values for the matrix
    N = parseInt(document.getElementById("matrix-size").value);
    MAX_ELEV = parseInt(document.getElementById("max-elevation").value);
    MIN_ELEV = parseInt(document.getElementById("min-elevation").value);
    ANCHOR_PERCENT = parseFloat(document.getElementById("anchor-percent").value);
    CLOSEST_ANCHOR_COUNT = parseFloat(document.getElementById("closest-anchor-count").value);
    // Reinitialize the matrices
    anchorCount = Math.floor(N * N * ANCHOR_PERCENT);
    randomCoordinates = getRandomCoordinates(
      N,
      anchorCount,
      MIN_ELEV,
      MAX_ELEV
    );
    randMatx = Array.from({ length: N }, () => Array(N).fill(0));
    populateMatx(randMatx, randomCoordinates);
    terrainInter(randMatx, N, randomCoordinates, CLOSEST_ANCHOR_COUNT);

    displayMatrix(randMatx, MAX_ELEV);
  });
});

// Function to enable matrix regeneration in the index.html

