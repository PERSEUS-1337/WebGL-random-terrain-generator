// Define the dimensions of the matrix
const rows = 25;
const cols = 25;

// Function to generate a random float between min and max
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// Create and initialize the 2D matrix with random values
let matrix = [];
for (let i = 0; i < rows; i++) {
  matrix[i] = [];
  for (let j = 0; j < cols; j++) {
    // let height = getRandomFloat(0, 100); // Adjust the range as needed
	let height = 0
    matrix[i][j] = height; // Store only the height value
  }
}

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
    rowIndexCell.appendChild(document.createTextNode(i+1));
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
