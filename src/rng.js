// Define the dimensions of the matrix
const n = 101; // Size of n x n matrix; n+1 always

// Function to display the matrix on the web page
function displayMatrix(matrix) {
  const container = document.getElementById("matrix-container");
  const table = document.createElement("table");

  // Create table headers
  const headerRow = document.createElement("tr");
//   const headers = ["Row\\Col"];

  const th = document.createElement("th");
  th.appendChild(document.createTextNode(" "));
  headerRow.appendChild(th);
  for (let j = 1; j <= n; j++) {
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
      cell.appendChild(document.createTextNode(cellData.toFixed(0)));
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  container.appendChild(table);
}

// Function to generate a random float between min and max
function getRandomFloat(min, max) {
  	return Math.random() * (max - min) + min;
}

// Function to generate a random float between 0 and max (integers start at 0)
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getMin(index) {
  return Math.floor(index / 10) * 10;
}

function getMax(index) {
  return Math.ceil(index / 10) * 10;
}

function populateMatx(matx, n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i % 10 === 0 && j % 10 === 0) {
        matx[i][j] = getRandomInt(100);
      }
    }
  }
}

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
          matx[i][j] = (matx[i][min_y] + matx[i][max_y]) / 2;
        } else if (j % 10 === 0) {
          // Horizontal axis point
          let min_x = getMin(i);
          let max_x = getMax(i);
          matx[i][j] = (matx[min_x][j] + matx[max_x][j]) / 2;
        }
      }
    }
  }
}


// Initialize the matrix with heights from the heightmap
let matx = Array.from({ length: n }, () => Array(n).fill(0));

populateMatx(matx, n);
terrainInter(matx, n);
console.log(matx);

// Display the matrix
document.addEventListener("DOMContentLoaded", () => {
  displayMatrix(matx);
});
