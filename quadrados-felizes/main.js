// inicializa o WebGL2
const canvas = document.querySelector('.example-canvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
  console.error('WebGL2 não está disponível');
  throw new Error('WebGL2 não suportado');
}

// inicializa o shader de vértice e fragmento e em seguida os compila
// são programas executados pela GPU sempre que algo precisa ser desenhado

const vertexShaderCode = `#version 300 es
    in vec2 position;
    uniform vec2 uOffset;

    void main() {
        gl_Position = vec4(position + uOffset, 0.0, 1.0);
    }
`;

const fragmentShaderCode = `#version 300 es
    precision highp float;
    uniform vec4 uColor;
    out vec4 outColor;

    void main() {
        outColor = uColor;
    }
`;

// ===== COMPILAÇÃO =====
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}
function drawSquare(gl, posx, posY, R, G, B, A) {
    gl.uniform2f(uOffsetLoc, posx, posY);
    gl.uniform4f(uColorLoc, R, G, B, A);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// ===== QUADRADO com TRIANGLE_FAN =====
// ordem importa!
const vertices = new Float32Array([
  -0.1, -0.1, // canto inferior esquerdo
   0.1, -0.1, // canto inferior direito
   0.1,  0.1, // canto superior direito
  -0.1,  0.1  // canto superior esquerdo
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// ===== ATRIBUTO =====
const positionLoc = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

// ===== UNIFORMS =====
const uOffsetLoc = gl.getUniformLocation(program, 'uOffset');
const uColorLoc = gl.getUniformLocation(program, 'uColor');

// ===== LIMPA TELA =====
gl.clearColor(0, 0.75, 0.75, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// ===== DESENHA QUADRADOS =====

drawSquare(gl, -0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
drawSquare(gl, 0.0, 0.5, 1.0, 0.0, 0.0, 1.0);
drawSquare(gl, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0);

drawSquare(gl, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0);
drawSquare(gl, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0);
drawSquare(gl, 0.5, 0.0, 1.0, 0.0, 1.0, 1.0);

drawSquare(gl, -0.5, -0.5, 0.0, 1.0, 1.0, 1.0);
drawSquare(gl, 0.0, -0.5, 0.6, 0.6, 0.6, 1.0);
drawSquare(gl, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0);
