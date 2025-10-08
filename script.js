// --- 1. CONFIGURACIÓN BÁSICA DE LA ESCENA ---
const scene = new THREE.Scene();

// Cámara (PerspectiveCamera: simula cómo ve el ojo humano)
const camera = new THREE.PerspectiveCamera(
    75, // Campo de visión (FOV)
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near (distancia mínima de renderizado)
    1000 // Far (distancia máxima de renderizado)
);

// Renderizador (dibuja la escena en el navegador)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de Cámara (para rotar, hacer zoom y mover la escena)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Efecto de inercia suave
controls.dampingFactor = 0.05;

// Posicionamos la cámara
camera.position.set(0, 5, 25);


// --- 2. ILUMINACIÓN Y FONDO ---

// Fondo (un color oscuro para simular el espacio)
scene.background = new THREE.Color(0x000008); 

// Función para crear texturas de estrellas (solo decorativo)
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const star = new THREE.Mesh(geometry, material);

    // Posición aleatoria
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));
    star.position.set(x, y, z);

    scene.add(star);
}
Array(200).fill().forEach(addStar);


// --- 3. CREACIÓN DE OBJETOS CÓSMICOS ---

// Crear un grupo para la Tierra y su órbita
const earthOrbit = new THREE.Group();
scene.add(earthOrbit);

// Función para crear esferas (Sol, Planetas)
function createSphere(radius, color, emissiveColor = 0x000000) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    // MeshStandardMaterial permite reflejar luces
    const material = new THREE.MeshStandardMaterial({ 
        color: color,
        emissive: emissiveColor // Emisión de luz propia
    });
    return new THREE.Mesh(geometry, material);
}

// ☀️ El Sol (Centro de la Escena y Fuente de Luz)
const SUN_RADIUS = 3;
const sun = createSphere(SUN_RADIUS, 0xFFA500, 0xFFA500); // Color y luz propia
scene.add(sun);

// Luz del Sol (PointLight irradia luz en todas direcciones)
const sunLight = new THREE.PointLight(0xFFFFFF, 3, 500); // Color, Intensidad, Distancia
scene.add(sunLight);


// 🌎 La Tierra (Un Planeta de ejemplo)
const EARTH_RADIUS = 1;
const earth = createSphere(EARTH_RADIUS, 0x00AAFF);
const EARTH_ORBIT_DISTANCE = 15;

// Colocamos la Tierra DENTRO del grupo de órbita
earth.position.set(EARTH_ORBIT_DISTANCE, 0, 0); 
earthOrbit.add(earth); 

// (Opcional) Trazar la órbita de la Tierra
const earthOrbitGeometry = new THREE.RingGeometry(EARTH_ORBIT_DISTANCE - 0.05, EARTH_ORBIT_DISTANCE + 0.05, 100);
const earthOrbitMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
const earthOrbitRing = new THREE.Mesh(earthOrbitGeometry, earthOrbitMaterial);
earthOrbitRing.rotation.x = Math.PI / 2; // Rotar 90 grados para que sea horizontal
scene.add(earthOrbitRing);


// --- 4. FUNCIÓN DE ANIMACIÓN ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Actualiza los controles de usuario
    
    const elapsedTime = clock.getElapsedTime();

    // 1. Rotación del Sol sobre su propio eje
    sun.rotation.y += 0.005;

    // 2. Órbita de la Tierra (rotamos el grupo completo)
    const EARTH_ORBIT_SPEED = 0.5; // Ajusta este valor para la velocidad orbital
    earthOrbit.rotation.y = elapsedTime * EARTH_ORBIT_SPEED;
    
    // 3. Rotación de la Tierra sobre su propio eje
    earth.rotation.y += 0.02;

    renderer.render(scene, camera);
}

animate();


// --- 5. RESPONSIVE DESIGN (Compatibilidad Móvil/Escritorio) ---

window.addEventListener('resize', () => {
    // 1. Actualiza la proporción de la cámara
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // 2. Ajusta el tamaño del renderizador al nuevo tamaño de la ventana
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // 3. Mejora el rendimiento en pantallas de alta densidad (como móviles)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
});
