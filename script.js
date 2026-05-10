// script.js
let scene, camera, renderer;
let heartParticles, stars;
let mouseX = 0, mouseY = 0;
const clock = new THREE.Clock();

const timelineData = [
    { text: "In the vastness of the universe...", cam: { z: 600 } },
    { text: "One light shines brighter than all others.", cam: { z: 450, x: 50 } },
    { text: "A light that nurtured my soul...", cam: { z: 500, x: -50, y: 30 } },
    { text: "I remember the warmth of your embrace.", img: "memory1.png", cam: { z: 350, y: -20 } },
    { text: "The joy of our walks under the sun.", img: "https://images.unsplash.com/photo-1544605949-50953186259c?auto=format&fit=crop&w=1000&q=80", cam: { z: 400, x: 80 } },
    { text: "The wisdom you shared in quiet moments.", img: "https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&w=1000&q=80", cam: { z: 400, x: -80, y: 50 } },
    { text: "And the love that binds us forever.", img: "memory4.png", cam: { z: 300, y: 0 } },
    { text: "Today, this heart beats for you.", cam: { z: 250 } },
    { text: "Happy Mother's Day, Mom.", cam: { z: 200 } }
];

let currentStep = 0;

function init() {
    console.log("Initializing Interactive Journey...");
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 1500);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('experience-container').appendChild(renderer.domElement);

    createStars();
    createHeart();
    addLights();

    window.addEventListener('resize', onWindowResize);
    setupJourney();
    animate();
}

function setupJourney() {
    const startBtn = document.getElementById('start-journey-btn');
    const nextBtn = document.getElementById('next-btn');
    const introScreen = document.getElementById('intro-screen');
    const finalScreen = document.getElementById('final-screen');
    const subtitleLayer = document.getElementById('subtitle-layer');
    const subtitleText = document.getElementById('subtitle-text');
    const memoryLayer = document.getElementById('memory-layer');
    const memoryImg = document.getElementById('memory-img');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    function showNextStep() {
        if (currentStep >= timelineData.length) {
            subtitleLayer.classList.add('hidden');
            finalScreen.classList.remove('hidden');
            progressContainer.classList.add('hidden');
            return;
        }

        const data = timelineData[currentStep];
        
        // Hide button during transition
        nextBtn.classList.remove('visible');
        nextBtn.classList.add('hidden');

        // Update Progress
        gsap.to(progressBar, { width: `${((currentStep + 1) / timelineData.length) * 100}%`, duration: 1 });

        // Camera Move
        gsap.to(camera.position, { 
            x: data.cam.x || 0, 
            y: data.cam.y || 0, 
            z: data.cam.z || 400, 
            duration: 3, 
            ease: "power2.inOut" 
        });

        // Text Reveal
        gsap.to(subtitleText, { opacity: 0, duration: 0.5, onComplete: () => {
            subtitleText.textContent = data.text;
            gsap.to(subtitleText, { opacity: 1, duration: 1 });
            
            // Show Next Button after a short delay
            setTimeout(() => {
                nextBtn.classList.remove('hidden');
                nextBtn.classList.add('visible');
            }, 2000);
        }});

        // Memory Reveal
        if (data.img) {
            gsap.to(memoryLayer, { opacity: 0, duration: 0.5, onComplete: () => {
                memoryImg.src = data.img;
                gsap.to(memoryLayer, { opacity: 1, duration: 1 });
            }});
        } else {
            gsap.to(memoryLayer, { opacity: 0, duration: 0.5 });
        }

        currentStep++;
    }

    startBtn.addEventListener('click', () => {
        gsap.to(introScreen, { opacity: 0, duration: 1.5, onComplete: () => {
            introScreen.classList.add('hidden');
            subtitleLayer.classList.remove('hidden');
            progressContainer.classList.remove('hidden');
            showNextStep();
        }});
    });

    nextBtn.addEventListener('click', showNextStep);

    document.getElementById('restart-btn').addEventListener('click', () => {
        currentStep = 0;
        finalScreen.classList.add('hidden');
        introScreen.classList.remove('hidden');
        gsap.set(introScreen, { opacity: 1 });
        camera.position.set(0, 0, 1500);
    });
}

function createStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 15000; i++) {
        vertices.push(
            THREE.MathUtils.randFloatSpread(2500),
            THREE.MathUtils.randFloatSpread(2500),
            THREE.MathUtils.randFloatSpread(2500)
        );
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.1 + 0.6, 0.5, 0.8); // Blueish stars
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

function createHeart() {
    const particleCount = 20000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xffafbd); // Rose
    const color2 = new THREE.Color(0xd4af37); // Gold

    for (let i = 0; i < particleCount; i++) {
        const t = Math.random() * Math.PI * 2;
        
        // Heart formula
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const z = (Math.random() - 0.5) * 5;

        const scale = 10;
        const r = Math.pow(Math.random(), 0.5); 
        positions[i * 3] = x * scale * r;
        positions[i * 3 + 1] = y * scale * r;
        positions[i * 3 + 2] = z * scale * (Math.random() * 8);

        const mix = Math.random();
        const finalColor = color1.clone().lerp(color2, mix);
        colors[i * 3] = finalColor.r;
        colors[i * 3 + 1] = finalColor.g;
        colors[i * 3 + 2] = finalColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    heartParticles = new THREE.Points(geometry, material);
    scene.add(heartParticles);
}

function addLights() {
    const pointLight = new THREE.PointLight(0xffafbd, 3, 1000);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Subtle heart pulse
    const pulse = 1 + Math.sin(elapsed * 2.5) * 0.04;
    heartParticles.scale.set(pulse, pulse, pulse);
    
    heartParticles.rotation.y += 0.003;
    stars.rotation.y -= 0.0003;

    renderer.render(scene, camera);
}

init();
