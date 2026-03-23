document.addEventListener('keydown', function(event) {
    const output = document.getElementById('output');
    
    // Get key information
    const key = event.key; // e.g., "Enter", "a", "Shift"
    const code = event.code; // e.g., "KeyA", "Enter", "ShiftLeft"

    if (key === 'c') {
        linhas = !linhas;
        drawTriangles();
    }
});


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

uniform float angulo;
uniform float lado;

void main() {
    float a = angulo * lado;

    float c = cos(a);
    float s = sin(a);

    mat2 rot = mat2(
        c, -s,
        s,  c
    );

    vec2 pos = rot * position;
    gl_Position = vec4(pos, 0.0, 1.0);
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

function drawTriangles() {
    // ===== LIMPA TELA =====
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ativa o VAO antes de desenhar
    gl.bindVertexArray(vao1);

    // ===== DESENHA NA TELA =====
    for (let i = 0; i < 4; i++) {
        gl.uniform1f(uAngulo, angulo);
        gl.uniform1f(uLado, i);
        gl.uniform4f(uColorLoc, 0.85, 0.85, 1, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        if(linhas) {
            gl.uniform4f(uColorLoc, 0, 0, 0, 1);
            gl.lineWidth(3); // largura da borda
            gl.drawArrays(gl.LINE_LOOP, 0, 3);
        }
    }
    // ativa o VAO antes de desenhar
    gl.bindVertexArray(vao2);

    // ===== DESENHA NA TELA =====
    for (let i = 0; i < 4; i++) {
        gl.uniform1f(uAngulo, angulo);
        gl.uniform1f(uLado, i);
        gl.uniform4f(uColorLoc, 0.85, 0.85, 1, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        if(linhas) {
            gl.uniform4f(uColorLoc, 0, 0, 0, 1);
            gl.lineWidth(3); // largura da borda
            gl.drawArrays(gl.LINE_LOOP, 0, 3);
        }
    }
}

function updateVerticesA() {
    angulo = 2 * Math.PI / 4;
    const vertices = new Float32Array([
        0.4, 0.4,
        raio * Math.cos(angulo) - raio * Math.sin(angulo) , 0 + raio * Math.sin(angulo),
        -0.4,  0.4
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}
function updateVerticesB() {
    angulo = 2 * Math.PI / 4;
    const vertices = new Float32Array([
        raio, raio,
        raio * Math.cos(angulo) - raio * Math.sin(angulo) , 0 + raio * Math.sin(angulo),
        0.4,  0.4
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

angulo = 2 * Math.PI / 4;
raio = 0.9;
linhas = false;

const positionLoc = gl.getAttribLocation(program, 'position');

const buffer1 = gl.createBuffer();
updateVerticesA();

const vao1 = gl.createVertexArray();
gl.bindVertexArray(vao1);


// tudo isso fica "gravado" no VAO
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);


const buffer2 = gl.createBuffer();
updateVerticesB();

const vao2 = gl.createVertexArray();
gl.bindVertexArray(vao2);

// tudo isso fica "gravado" no VAO
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

// unbind
gl.bindVertexArray(null);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// ===== UNIFORMS =====
const uAngulo = gl.getUniformLocation(program, 'angulo');
const uLado = gl.getUniformLocation(program, 'lado');
const uColorLoc = gl.getUniformLocation(program, 'uColor');

drawTriangles();