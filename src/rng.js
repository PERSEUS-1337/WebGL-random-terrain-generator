// Function to display the matrix on the web page
function displayMatrix(matrix, max_elev) {
  const container = document.getElementById("matrix-container");
  container.innerHTML = ""; // Clear previous content
  const table = document.createElement("table");

  // Create table rows
  for (let i = 0; i < matrix.length; i++) {
    const row = document.createElement("tr"); // Create a table row
    for (let j = 0; j < matrix[i].length; j++) {
      const cell = document.createElement("td"); // Create a table cell
      const cellData = matrix[i][j];

      // Set cell background color based on elevation value
      cell.style.backgroundColor = `rgb(${Math.floor(
        (cellData / max_elev) * 255
      )}, ${Math.floor((cellData / max_elev) * 255)}, ${Math.floor(
        (cellData / max_elev) * 255
      )})`;
      cell.textContent = cellData.toFixed(2); // Display the data inside the cell
      row.appendChild(cell); // Add cell to the row
    }
    table.appendChild(row); // Add row to the table
  }

  container.appendChild(table); // Add table to the container
  console.log(matrix); // Log the matrix to the console
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

// Function to generate random coordinates and elevations for a given matrix size
function getRandomCoordinates(n, count, min, max) {
  let coordinates = [];
  while (coordinates.length < count) {
    let x = getRandomInt(n); // Random x-coordinate
    let y = getRandomInt(n); // Random y-coordinate
    let elevation = getRandomFloatInRange(min, max); // Random elevation
    let key = `${x},${y}`; // Create a unique key for the coordinate

    // Ensure the coordinate is unique
    if (!coordinates.some((coord) => coord.key === key)) {
      coordinates.push({ x, y, elevation, key });
    }
  }
  return coordinates;
}

// Function to populate matrix with elevations at the specified coordinates
function populateMatx(matx, coordinates) {
  coordinates.forEach((coord) => {
    matx[coord.x][coord.y] = coord.elevation; // Set elevation at specified coordinate
  });
}

// Function to find the four closest anchor points for interpolation
function findClosestAnchors(i, j, anchors, count) {
  // Calculate distance of each anchor point from (i, j)
  let sortedAnchors = anchors
    .map((anchor) => ({
      ...anchor,
      distance: Math.sqrt(Math.pow(anchor.x - i, 2) + Math.pow(anchor.y - j, 2)),
    }))
    .sort((a, b) => a.distance - b.distance); // Sort anchors by distance

  return sortedAnchors.slice(0, count); // Return the closest anchor points
}


// Function to interpolate terrain elevations for a given matrix
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
            // If distance is zero, use anchor's elevation directly
            weightedElevation = matx[anchor.x][anchor.y];
            totalWeight = 1;
            return false; // Exit the loop
          } else {
            // Calculate weight based on distance
            let weight = 1 / Math.pow(distance, p);
            totalWeight += weight;
            weightedElevation += matx[anchor.x][anchor.y] * weight;
          }
        });

        if (totalWeight > 0) {
          // Set the interpolated elevation
          matx[i][j] = weightedElevation / totalWeight;
        }
      }
    }
  }
}

// Function to calculate the average height of the matrix
function calculateAverageHeight(matrix) {
  let totalHeight = 0;
  let numberOfElements = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      totalHeight += matrix[i][j]; // Sum the elevation values
      numberOfElements++; // Count the number of elements
    }
  }

  // Calculate and return the average height
  let averageHeight = totalHeight / numberOfElements;
  averageHeight = parseFloat(averageHeight.toFixed(4)); // Round to 4 decimal places
  return averageHeight;
}
// ### END OF FUNCTION DECLARATIONS

// Define default values for the matrix
let N = 50; // Matrix size (NxN)
let MAX_ELEV = 25; // Maximum elevation value
let MIN_ELEV = 0; // Minimum elevation value
let ANCHOR_PERCENT = 0.01; // Percentage of matrix cells to be used as anchor points
let CLOSEST_ANCHOR_COUNT = 4; // Number of closest anchors to consider for interpolation

// Function to display the matrix in the rng_test.html
document.addEventListener("DOMContentLoaded", () => {
  // Extract values from HTML input elements
  N = parseInt(document.getElementById("matrix-size").value); // Size of the matrix (NxN)
  MAX_ELEV = parseInt(document.getElementById("max-elevation").value); // Maximum elevation value
  MIN_ELEV = parseInt(document.getElementById("min-elevation").value); // Minimum elevation value
  ANCHOR_PERCENT = parseFloat(document.getElementById("anchor-percent").value); // Percentage of cells to be used as anchor points
  CLOSEST_ANCHOR_COUNT = parseFloat(document.getElementById("closest-anchor-count").value); // Number of closest anchors to consider for interpolation

  // Initialize the matrices
  let anchorCount = Math.floor(N * N * ANCHOR_PERCENT); // Calculate number of anchor points
  let randomCoordinates = getRandomCoordinates(N, anchorCount, MIN_ELEV, MAX_ELEV); // Generate random coordinates with elevations
  let randMatx = Array.from({ length: N }, () => Array(N).fill(0)); // Create an NxN matrix initialized with zeros
  populateMatx(randMatx, randomCoordinates); // Populate the matrix with the generated random coordinates
  terrainInter(randMatx, N, randomCoordinates, CLOSEST_ANCHOR_COUNT); // Interpolate the matrix to fill in elevation values

  // Display the matrix on the web page
  displayMatrix(randMatx, MAX_ELEV);

  // Event listener for the regenerate button
  document.getElementById("regenerate-button").addEventListener("click", () => {
    // Fetch new values for the matrix from HTML input elements
    N = parseInt(document.getElementById("matrix-size").value); // Size of the matrix (NxN)
    MAX_ELEV = parseInt(document.getElementById("max-elevation").value); // Maximum elevation value
    MIN_ELEV = parseInt(document.getElementById("min-elevation").value); // Minimum elevation value
    ANCHOR_PERCENT = parseFloat(document.getElementById("anchor-percent").value); // Percentage of cells to be used as anchor points
    CLOSEST_ANCHOR_COUNT = parseFloat(document.getElementById("closest-anchor-count").value); // Number of closest anchors to consider for interpolation

    // Reinitialize the matrices
    anchorCount = Math.floor(N * N * ANCHOR_PERCENT); // Recalculate number of anchor points
    randomCoordinates = getRandomCoordinates(N, anchorCount, MIN_ELEV, MAX_ELEV); // Regenerate random coordinates with elevations
    randMatx = Array.from({ length: N }, () => Array(N).fill(0)); // Create a new NxN matrix initialized with zeros
    populateMatx(randMatx, randomCoordinates); // Repopulate the matrix with the new random coordinates
    terrainInter(randMatx, N, randomCoordinates, CLOSEST_ANCHOR_COUNT); // Interpolate the new matrix to fill in elevation values

    // Display the regenerated matrix on the web page
    displayMatrix(randMatx, MAX_ELEV);
  });
});

