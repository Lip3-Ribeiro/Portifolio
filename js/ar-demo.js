
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const MODEL_URL =
    "https://files.innerscene.com/library/iec-0-75-kw-electric-motor-with-terminal-box-b14bac83/1796b086c673894a69e0/iec-0-75-kw-electric-motor-with-terminal-box.glb";


/* =========================================================
   HTML DA DEMONSTRAÇÃO
========================================================= */

function criarHTMLDemo() {

    return `
        <div class="ar-demo">

            <!-- HEADER -->
            <div class="ar-header">

                <div class="ar-brand">
                    <div class="ar-brand-icon">
                        <i data-lucide="scan"></i>
                    </div>

                    <div>
                        <strong>AR MAINTENANCE</strong>
                        <small>INDUSTRIAL EQUIPMENT VIEWER</small>
                    </div>
                </div>

                <button class="ar-scan-button" id="arSimulateQR">
                    <i data-lucide="qr-code"></i>
                    Simular leitura QR
                </button>

            </div>


            <!-- STATUS -->
            <div class="ar-stats">

                <div class="ar-stat">
                    <i data-lucide="qr-code"></i>
                    <span>IDENTIFICAÇÃO</span>
                    <strong id="arDeviceCode">QR-M002</strong>
                </div>

                <div class="ar-stat">
                    <i data-lucide="activity"></i>
                    <span>STATUS</span>
                    <strong class="ar-status">
                        <span></span>
                        Atenção
                    </strong>
                </div>

            </div>


            <!-- VIEWER 3D -->
            <section class="ar-viewer">

                <div class="ar-viewer-heading">
                    <span>
                        <i class="ar-pulse-dot"></i>
                        LIVE 3D VIEW
                    </span>

                    <span>GLB / 3D</span>
                </div>

                <div id="motorViewer" class="ar-canvas">

                    <div class="ar-loading" id="arLoading">
                        <div class="ar-spinner"></div>
                        <span>Carregando modelo 3D...</span>
                    </div>

                </div>

                <div class="ar-viewer-footer">
                    <span><i data-lucide="mouse"></i> Arraste para rotacionar</span>
                    <span>Scroll para zoom</span>

                    <button id="arResetView">
                        <i data-lucide="rotate-ccw"></i>
                        Resetar
                    </button>
                </div>

            </section>


            <!-- EQUIPAMENTO -->
            <section class="ar-equipment">

                <div class="ar-equipment-label">
                    EQUIPAMENTO IDENTIFICADO
                    <i data-lucide="factory"></i>
                </div>

                <h3>Motor Elétrico Industrial</h3>

                <div class="ar-details">
                    <p><span>Modelo:</span> IEC 0.75 kW</p>
                    <p><span>Identificação:</span> QR-M002</p>
                    <p><span>Setor:</span> Produção B</p>
                    <p><span>Potência:</span> 0.75 kW</p>
                </div>

                <div class="ar-tags">
                    <span>Motor elétrico</span>
                    <span>Visualização 3D</span>
                    <span>Inspeção digital</span>
                </div>

                <button class="ar-checklist-toggle" id="arOpenChecklist">
                    <i data-lucide="clipboard-check"></i>
                    VER CHECKLIST
                    <i data-lucide="arrow-up-right"></i>
                </button>

            </section>


            <!-- CHECKLIST -->
            <section class="ar-checklist" id="arChecklist">

                <div class="ar-checklist-header">

                    <div>
                        <span>INSPEÇÃO SIMULADA</span>
                        <h4>Checklist de manutenção</h4>
                    </div>

                    <button id="arCloseChecklist">
                        <i data-lucide="x"></i>
                    </button>

                </div>

                <p class="ar-checklist-description">
                    Marque os itens para simular a inspeção.
                </p>

                <div class="ar-progress-track">
                    <div id="arProgressBar"></div>
                </div>

                <p class="ar-progress-text" id="arProgressText">
                    0 de 4 itens concluídos
                </p>

                <div class="ar-checklist-items">

                    <label class="ar-check-item">
                        <input type="checkbox">
                        <span class="ar-check-box"></span>
                        <span>Verificar condições externas do motor</span>
                    </label>

                    <label class="ar-check-item">
                        <input type="checkbox">
                        <span class="ar-check-box"></span>
                        <span>Inspecionar fixação e suportes</span>
                    </label>

                    <label class="ar-check-item">
                        <input type="checkbox">
                        <span class="ar-check-box"></span>
                        <span>Verificar ventilação do equipamento</span>
                    </label>

                    <label class="ar-check-item">
                        <input type="checkbox">
                        <span class="ar-check-box"></span>
                        <span>Registrar condição geral de operação</span>
                    </label>

                </div>

                <div class="ar-complete" id="arComplete">
                    <i data-lucide="check-circle"></i>
                    Inspeção simulada concluída!
                </div>

                <button class="ar-reset-checklist" id="arResetChecklist">
                    Reiniciar checklist
                </button>

            </section>

        </div>
    `;
}


/* =========================================================
   SWEETALERT - ABERTURA
========================================================= */

/* =========================================================
   EVENTO DE ABERTURA DA DEMONSTRAÇÃO
========================================================= */

document.addEventListener("click", event => {

    const button = event.target.closest("[data-open-ar]");

    if (!button) return;

    abrirDemo();

});


function abrirDemo() {

    Swal.fire({

        html: criarHTMLDemo(),

        width: "1050px",

        padding: "0",

        background: "#111315",

        showConfirmButton: false,

        showCloseButton: true,

        closeButtonHtml: '<i data-lucide="x"></i>',

        customClass: {
            popup: "ar-swal-popup",
            htmlContainer: "ar-swal-container",
            closeButton: "ar-swal-close"
        },

        backdrop: "rgba(3,5,4,.88)",

        allowOutsideClick: true,

        didOpen: () => {

            // Renderiza ícones Lucide
            if (window.lucide) {
                window.lucide.createIcons();
            }

            inicializarViewer();
            inicializarChecklist();
            inicializarQR();

        },

        willClose: () => {

            destruirViewer();

        }

    });

}


/* =========================================================
   THREE.JS - VARIÁVEIS
========================================================= */

let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let motorModel = null;

let animationFrame = null;
let resizeObserver = null;


/* =========================================================
   INICIALIZAR VIEWER
========================================================= */

function inicializarViewer() {

    const viewer = document.getElementById("motorViewer");

    if (!viewer) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#0D1915");


    /* CAMERA */

    camera = new THREE.PerspectiveCamera(
        45,
        viewer.clientWidth / viewer.clientHeight,
        0.1,
        1000
    );

    camera.position.set(3, 2.2, 4);


    /* RENDERER */

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        viewer.clientWidth,
        viewer.clientHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    viewer.appendChild(renderer.domElement);


    /* LIGHTS */

    scene.add(
        new THREE.AmbientLight(0xffffff, 2)
    );

    const mainLight = new THREE.DirectionalLight(
        0xffffff,
        3
    );

    mainLight.position.set(4, 6, 5);
    mainLight.castShadow = true;

    scene.add(mainLight);


    const greenLight = new THREE.PointLight(
        0xA3E635,
        18,
        10
    );

    greenLight.position.set(-3, 1, -2);

    scene.add(greenLight);


    /* CONTROLS */

    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    controls.enableZoom = true;
    controls.enablePan = true;

    controls.minDistance = 1.5;
    controls.maxDistance = 9;

    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;


    controls.addEventListener("start", () => {
        controls.autoRotate = false;
    });

    // RESET DA CÂMERA
    document.getElementById("arResetView")
        ?.addEventListener("click", () => {

            if (!motorModel) return;

            ajustarCamera();
            controls.autoRotate = true;

        });


    /* LOAD MODEL */

    const loader = new GLTFLoader();

    loader.load(

        MODEL_URL,

        gltf => {

            motorModel = gltf.scene;

            motorModel.traverse(object => {

                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }

            });


            // Centraliza o objeto
            const box = new THREE.Box3().setFromObject(motorModel);

            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            motorModel.position.sub(center);


            // Normaliza o tamanho
            const maxDimension = Math.max(size.x, size.y, size.z);

            if (maxDimension > 0) {
                motorModel.scale.setScalar(2.2 / maxDimension);
            }

            scene.add(motorModel);

            ajustarCamera();

            document.getElementById("arLoading")
                ?.classList.add("hidden");

        },

        progress => {

            if (progress.total > 0) {

                const percent = Math.round(
                    progress.loaded / progress.total * 100
                );

                const loadingText = document.querySelector(
                    "#arLoading span"
                );

                if (loadingText) {
                    loadingText.textContent =
                        `Carregando modelo 3D... ${percent}%`;
                }

            }

        },

        error => {

            console.error("Erro ao carregar GLB:", error);

            const loadingText = document.querySelector(
                "#arLoading span"
            );

            if (loadingText) {
                loadingText.textContent =
                    "Falha ao carregar o modelo 3D.";
            }

        }

    );


    /* ANIMATION */

    function animate() {

        animationFrame = requestAnimationFrame(animate);

        controls?.update();

        renderer?.render(scene, camera);

    }

    animate();


    /* RESIZE */

    resizeObserver = new ResizeObserver(() => redimensionarViewer());

    resizeObserver.observe(viewer);

}


/* =========================================================
   CAMERA
========================================================= */

function ajustarCamera() {

    if (!motorModel) return;

    const box = new THREE.Box3().setFromObject(motorModel);

    const size = box.getSize(new THREE.Vector3());

    const maxDimension = Math.max(
        size.x,
        size.y,
        size.z
    );

    const distance = maxDimension * 1.8;

    camera.position.set(
        distance,
        distance * 0.65,
        distance
    );

    controls.target.set(0, 0, 0);

    controls.update();

}




/* =========================================================
   RESIZE
========================================================= */

function redimensionarViewer() {

    const viewer = document.getElementById("motorViewer");

    if (!viewer || !renderer || !camera) return;

    const width = viewer.clientWidth;
    const height = viewer.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}


/* =========================================================
   DESTRUIR VIEWER
========================================================= */

function destruirViewer() {

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    resizeObserver?.disconnect();
    resizeObserver = null;

    controls?.dispose();
    controls = null;

    if (motorModel) {

        motorModel.traverse(object => {

            if (object.isMesh) {

                object.geometry?.dispose();

                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material?.dispose();
                }

            }

        });

        motorModel = null;

    }

    renderer?.dispose();
    renderer?.domElement.remove();

    renderer = null;
    camera = null;
    scene = null;

}


/* =========================================================
   QR CODE SIMULADO
========================================================= */

function inicializarQR() {

    const button = document.getElementById("arSimulateQR");

    if (!button) return;

    button.addEventListener("click", () => {

        button.classList.add("scanned");

        button.innerHTML = `
            <i data-lucide="check-circle"></i>
            QR-M002 IDENTIFICADO
        `;

        document.getElementById("arDeviceCode").textContent =
            "QR-M002";

        if (window.lucide) {
            window.lucide.createIcons();
        }

    });

}


/* =========================================================
   CHECKLIST
========================================================= */

function inicializarChecklist() {

    const checklist = document.getElementById("arChecklist");

    const openButton = document.getElementById("arOpenChecklist");
    const closeButton = document.getElementById("arCloseChecklist");
    const resetButton = document.getElementById("arResetChecklist");

    const progressBar = document.getElementById("arProgressBar");
    const progressText = document.getElementById("arProgressText");

    const completeMessage = document.getElementById("arComplete");

    const inputs = checklist.querySelectorAll(
        'input[type="checkbox"]'
    );


    /* ABRIR */

    openButton.addEventListener("click", () => {

        checklist.classList.add("visible");

        checklist.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });


    /* FECHAR */

    closeButton.addEventListener("click", () => {
        checklist.classList.remove("visible");
    });


    /* ATUALIZAR */

    function atualizarProgresso() {

        const completed = [...inputs].filter(
            input => input.checked
        ).length;

        const total = inputs.length;

        const percent = total
            ? (completed / total) * 100
            : 0;

        progressBar.style.width = `${percent}%`;

        progressText.textContent =
            `${completed} de ${total} itens concluídos`;

        completeMessage.classList.toggle(
            "visible",
            completed === total && total > 0
        );

    }

    inputs.forEach(input => {
        input.addEventListener("change", atualizarProgresso);
    });


    /* RESET */

    resetButton.addEventListener("click", () => {

        inputs.forEach(input => {
            input.checked = false;
        });

        atualizarProgresso();

    });

}
