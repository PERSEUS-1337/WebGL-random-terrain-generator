# Random Terrain Generator

## Overview
Welcome to the **Random Terrain Generator** project! This application demonstrates how to generate random terrain using a combination of Python and WebGL. The terrains created can be exported for use in various applications such as game maps or sandbox world demonstrations.

## Authors
- Aron Resty Ramillano
- John Maui Borja
- Angelica Nicolette Adoptante
- Elijah Gabriel Malazarte

## Course
This project was developed as part of the CMSC 161 Interactive Computer Graphics course.

## Project Premise
The goal of this project is to create a tool that generates random terrains, which can be visualized using WebGL. The generated terrains are intended to be versatile and suitable for use in games, simulations, or any other context requiring dynamically created landscapes.

## Technologies Used
- **Python**: Used for the random number generation (RNG) part of the terrain generation process.
- **JavaScript**: Used for implementing the WebGL rendering and visualization of the generated terrain.

## Features
- **Random Terrain Generation**: Generates unique terrains each time, ensuring diverse landscapes.
- **WebGL Visualization**: Uses WebGL to render and display the generated terrains in a web browser.
- **Export Functionality**: Allows users to export the generated terrains for use in external applications.

## Installation
### Prerequisites
- Python 3.x
- Node.js
- A modern web browser that supports WebGL

### Setup
1. **Clone the repository**:
   ```sh
   git clone https://github.com/PERSEUS-1337/WebGL-random-terrain-generator.git
   cd WebGL-random-terrain-generator
   ```

2. **Install Python dependencies**:
   ```sh
   pip install -r requirements.txt
   ```

3. **Install JavaScript dependencies**:
   ```sh
   npm install
   ```

## Usage
1. **Generate Terrain using Python**:
   ```sh
   python generate_terrain.py
   ```
   This script will generate the terrain data and save it to a file that can be read by the WebGL application.

2. **Start the WebGL Application**:
   ```sh
   npm start
   ```
   This will start a local web server and open the WebGL application in your default web browser.

3. **View and Export Terrain**:
   - Use the controls in the WebGL application to navigate and view the generated terrain.
   - Use the export functionality to save the terrain for use in other applications.

## How it Works
### Terrain Matrix Generation
The terrain essentially is just a randomly generated matrix with a bunch of values that determine what should be displayed on that specific block and on what specific location.


## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
We would like to thank our CMSC 161 instructors and peers for their support and guidance throughout the development of this project.

---

Feel free to reach out if you have any questions or feedback. Enjoy exploring and creating with the Random Terrain Generator!

---

## Resources
- https://www.w3schools.com/python/pandas/pandas_dataframes.asp
