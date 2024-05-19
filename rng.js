// Define the dimensions of the matrix
const rows = 20;
const cols = 20;
const size = Math.max(rows, cols) + 1; // Size must be a power of 2 plus 1
const max = size - 1;

// Function to generate a random float between min and max
function getRandomFloat(min, max) {
  	return Math.random() * (max - min) + min;
}

// Function to set a value in the matrix
function set(x, y, val) {
	if (x >= 0 && x < size && y >= 0 && y < size) {
		heightmap[x][y] = val;
	}
}

// Initialize the heightmap with zeros
let heightmap = Array(size)
  .fill()
  .map(() => Array(size).fill(0));

// Set specific values in the heightmap
heightmap[0][0] = getRandomFloat(0, max);
heightmap[0][max-1] = getRandomFloat(0, max);
heightmap[max-1][0] = getRandomFloat(0, max);
heightmap[max-1][max-1] = getRandomFloat(0, max);

// Diamond-Square algorithm
function diamondSquare(stepSize) {
	let halfStep = stepSize / 2;

	// Diamond step
	for (let x = halfStep; x < size - 1; x += stepSize) {
		for (let y = halfStep; y < size - 1; y += stepSize) {
			let avg =
				(heightmap[x - halfStep][y - halfStep] +
				heightmap[x - halfStep][y + halfStep] +
				heightmap[x + halfStep][y - halfStep] +
				heightmap[x + halfStep][y + halfStep]) /
				4;
			heightmap[x][y] = avg + getRandomFloat(-stepSize, stepSize);
		}
	}

	// Square step
	for (let x = 0; x < size; x += halfStep) {
		for (let y = (x + halfStep) % stepSize; y < size; y += stepSize) {
			let avg =
				(heightmap[(x - halfStep + size) % size][y] +
				heightmap[(x + halfStep) % size][y] +
				heightmap[x][(y - halfStep + size) % size] +
				heightmap[x][(y + halfStep) % size]) /
				4;
			heightmap[x][y] = avg + getRandomFloat(-halfStep, halfStep);
		}
	}
}

// THIS SHIT IS BROKEN
// Initialize the Diamond-Square algorithm
// let stepSize = max;
// while (stepSize > 1) {
// 	diamondSquare(stepSize);
// 	stepSize /= 2;
// }

// Initialize the matrix with heights from the heightmap
let matrix = Array(rows)
	.fill()
	.map(() => Array(cols).fill(0));
for (let i = 0; i < rows; i++) {
	for (let j = 0; j < cols; j++) {
		matrix[i][j] = heightmap[i][j];
	}
}

console.log(matrix);

// Function to display the matrix on the web page
function displayMatrix(matrix) {
  const container = document.getElementById("matrix-container");
  const table = document.createElement("table");

  // Create table headers
  const headerRow = document.createElement("tr");
  const headers = ["Row\\Col"];

  const th = document.createElement("th");
  th.appendChild(document.createTextNode(headers));
  headerRow.appendChild(th);
  for (let j = 1; j <= cols; j++) {
    const th = document.createElement("th");
    th.appendChild(document.createTextNode(j));
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  // Create table rows
  for (let i = 0; i < matrix.length; i++) {
    const row = document.createElement("tr");

    const rowIndexCell = document.createElement("td");
    rowIndexCell.appendChild(document.createTextNode(i + 1));
    row.appendChild(rowIndexCell);

    for (let j = 0; j < matrix[i].length; j++) {
      const cell = document.createElement("td");
      const cellData = matrix[i][j];
      cell.appendChild(document.createTextNode(cellData.toFixed(2)));
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  container.appendChild(table);
}

// Display the matrix
document.addEventListener("DOMContentLoaded", () => {
  displayMatrix(matrix);
});
