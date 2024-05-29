// Function to display the matrix on the web page
function displayMatrix(matrix) {
	const container = document.getElementById("matrix-container");
	const table = document.createElement("table");

	// Create table headers
	const headerRow = document.createElement("tr");
	const th = document.createElement("th");
	th.appendChild(document.createTextNode(" "));
	headerRow.appendChild(th);
	for (let j = 1; j <= matrix[0].length; j++) {
		const th = document.createElement("th");
		th.appendChild(document.createTextNode(j));
		headerRow.appendChild(th);
	}
	table.appendChild(headerRow);

	// Find the maximum value in the matrix
	let maxVal = -Infinity;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] > maxVal) {
				maxVal = matrix[i][j];
			}
		}
	}

	// Create table rows
	for (let i = 0; i < matrix.length; i++) {
		const row = document.createElement("tr");

		const rowIndexCell = document.createElement("td");
		rowIndexCell.appendChild(document.createTextNode(i + 1));
		row.appendChild(rowIndexCell);

		for (let j = 0; j < matrix[i].length; j++) {
			const cell = document.createElement("td");
			const cellData = matrix[i][j];
			cell.appendChild(document.createTextNode(cellData.toFixed(0)));

			// Set cell background color based on the value
			const brightness = (cellData / maxVal) * 100; // Normalize to percentage
			cell.style.backgroundColor = `hsl(40, 100%, ${brightness}%)`; // Blue color with varying brightness

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
		if (!coordinates.some(coord => coord.key === key)) {
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
  coordinates.forEach(coord => {
    matx[coord.x][coord.y] = getRandomInt(MAX_ELEV);
  });
}

// Function to find the four closest anchor points for interpolation
function findClosestAnchors(i, j, anchors) {
  let sortedAnchors = anchors.map(anchor => ({
    ...anchor,
    distance: Math.abs(anchor.x - i) + Math.abs(anchor.y - j)
  })).sort((a, b) => a.distance - b.distance);
    
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
			if (matx[i][j] === 0) { // Only interpolate uninitialized points
				let closestAnchors = findClosestAnchors(i, j, anchors);
				let totalWeight = 0;
				let weightedElevation = 0;

				closestAnchors.forEach(anchor => {
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

// Define the dimensions of the matrix
const N = 101; // Size of n x n matrix; n+1 always
const MAX_ELEV = 25;	

const ANCHOR_PERCENT = 0.01;
let anchorCount = Math.floor(N * N * ANCHOR_PERCENT);
let randomCoordinates = getRandomCoordinates(N, anchorCount);


// Initialize the matrix with heights from the heightmap
let matx = Array.from({ length: N }, () => Array(N).fill(0));
let randMatx = Array.from({ length: N }, () => Array(N).fill(0));


populateMatx(matx, N);
terrainInter(matx, N);
randPopulateMatx(randMatx, N, randomCoordinates);
randTerrainInter(randMatx, N, randomCoordinates);

// Display the matrix
document.addEventListener("DOMContentLoaded", () => {
  	displayMatrix(randMatx);
});
