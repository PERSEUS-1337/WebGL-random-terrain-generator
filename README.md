# Random Terrain Generator

## Overview
	This 3D Terrain Generation web application generates a 3D terrain using WebGL, HTML 5.0, and JavaScript for the course CMSC 161 - Interactive Computer Graphics. The application utilized a basic cube mesh as building blocks for an nxn plane. The application uses a Random Number Generator (RNG) system to assign heights to the cubes, giving the generated terrain varied elevations.

## Authors
- Aron Resty Ramillano
- John Maui Borja
- Angelica Adoptante
- Elijah Gabriel Malazarte

## Course
This project was developed as part of the CMSC 161 Interactive Computer Graphics course.

## Technologies Used
- **JavaScript**: Used for implementing the WebGL rendering, visualization, and generation of the terrain.

## Features
- **Random Terrain Generation**: Generates unique terrains each time, ensuring diverse landscapes.
- **WebGL Visualization**: Uses WebGL to render and display the generated terrains in a web browser.

## Installation
### Prerequisites
- A modern web browser that supports WebGL

### Setup
1. **Clone the repository**:
   ```sh
   git clone https://github.com/PERSEUS-1337/WebGL-random-terrain-generator.git
   cd WebGL-random-terrain-generator
   ```
2. **Open index.html with a browser.**

## Usage

1. **Main Viewport**
- Move the camera using WASD for forward, left, back, and right movements respectively.
- Press/hold Q/E to fly down and up respectively.
- Press and hold left click (Mouse 1) in the viewport to rotate the model manually.
- Scroll in and out to zoom in and out.
- In the Control Panel, under Camera Controls, there are two buttons for camera movement:
   ```Auto Rotate``` rotates the model in a loop.
   ```Reset Camera``` returns the position of the camera to its initial placement.
2. **Control Panel - Terrain Settings**
- Matrix Size dictates the nxn size of the map to be generated. The default is 50.
- Max Elevation dictates the maximum elevation, 10 being the default. Higher elevations may result in surreal terrains.
- Min Elevation dictates the minimum elevation possible, 0 being the default.
- Anchor Percent dictates how many of the cubes will act as points to use for height estimation.
- Closest Anchor Count dictates how many of the nearest anchors will be used for interpolating a cube’s height.
- Press regenerate to regenerate the terrain using the settings provided. Higher values may take longer to generate. 
3. **Control Panel - Day/Night Controls** 
- Slider displays the current time and can be dragged left or right to adjust the sun’s position.
- Pressing the Start Day/Night Cycle button will animate the movement of the sun. 
4. **Control Panel - Presets** <br>
   Presets are pre-determined values for the terrain settings above. Choosing a preset changes the values in the terrain settings field. Press generate preset to enact the changes, or modify the values first and press regenerate instead.
   Current Presets: Default, Bigger, Recommended Maximum, Superflat Snow 
5. **Terrain Palette** <br>
   Changes the color palette used by the generator. Takes effect immediately, no need to regenerate/generate.
   Current Palettes: Default, Sand, Jungle, Frozen, Heatmap
   
## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
We would like to thank our CMSC 161 instructors and peers for their support and guidance throughout the development of this project.

---

Feel free to reach out if you have any questions or feedback. Enjoy exploring and creating with the Random Terrain Generator!

---