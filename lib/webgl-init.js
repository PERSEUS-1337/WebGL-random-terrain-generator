/**
 * Author: James Plaras
 * 
 * References:  http://www.comp.lancs.ac.uk/~rodger/webgl/lib/cuon-utils.js
 *              https://code.google.com/p/webglsamples/source/browse/book/webgl-utils.js?r=41401f8a69b1f8d32c6863ac8c1953c8e1e8eba0
 *              https://www.khronos.org/registry/webgl/sdk/debug/webgl-debug.js
 * 
 * 
 * Library for initializing webgl context, program and shaders using webgl-units based on various init utilities in webGL
 */

/** 
 * Initialize and get the rendering for WebGL
 * @param canvas <canvas> element
 * @param opt_debug flag to initialize the context for debugging
 * @return the rendering context for WebGL
 */
function initializeWebGL(canvas,opt_debug) {
  // Get the rendering context for WebGL
  var gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) return null;

  // if opt_debug is explicitly false, create the context for debugging
  if (arguments.length < 2 || opt_debug) {
    gl = WebGLDebugUtils.makeDebugContext(gl);
  }

  return gl;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param id the id of the shader object to be created
 * @return created shader object, or null if the creation has failed.
 */
function initializeShader(gl,id) {
  var script = document.getElementById(id);
  var src = script.textContent;


  var shader;
  //Create shader object based on shader type
  if(script.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }
  }
  else if(script.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }
  }
  else {
    console.log("script.type may not be existent or unrecognized type");
    return null;
  }

  //Set the shader program
  gl.shaderSource(shader,src);

  //Compile the shader
  gl.compileShader(shader);

  //Check the result of compilation
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    
    return null;
  }

  return shader;
}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vertexShader a vertex shader program ( using initializeShader() )
 * @param fragmentShader a fragment shader program ( using initializeShader() )
 * @return created program object, or null if the creation has failed
 */
function initializeProgram(gl,vertexShader,fragmentShader) {
  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }
  
  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }

  return program;
}