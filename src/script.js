import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { gsap } from "gsap";

import * as position from "./lightPosition.js";

/**
 ******************************
 ****** Three.js Initial ******
 ******************************
 */
// Debug
// const gui = new dat.GUI();

/**
 * Init
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(5, 5, -5);
scene.add(camera);

/**
 * Addition
 */
// Controls
const orbitControls = new OrbitControls(camera, canvas);
// orbitControls.target.set(0, 0.75, 0);
orbitControls.enableDamping = true;
const targetDirection = new THREE.Vector3(-1, 0, 0);

// Lights
const ambientLight = new THREE.AmbientLight(0x161e33, 0.8);
scene.add(ambientLight);

// ModelViewer
// let pmremGenerator = new THREE.PMREMGenerator(renderer);
// scene.environment = pmremGenerator.fromScene(
//   new RoomEnvironment(),
//   0.04
// ).texture;

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let pointedObject;

/**
 ******************************
 ************ Main ************
 ******************************
 */

/**
 * Definitions
 */
// Light Positions
let Light_Car_Y = position.pos_Light_Car_Y;
let Light_Car_W = position.pos_Light_Car_W;
let Light_RightTitle = position.pos_Light_RightTitle;
let Light_LeftTitle = position.pos_Light_LeftTitle;
let Light_ad = position.pos_Light_ad;
let Light_phone = position.pos_Light_phone;
let Light_Juice = position.pos_Light_Juice;
let Light_Room = position.pos_Light_Room;
let Light_Road = position.pos_Light_Road;
let Light_StreetLamp = position.pos_Light_StreetLamp;
let Position_phone = position.Position_phone;
let Position_storage = position.Position_storage;
let Position_Juice2 = position.Position_Juice2;
let Position_Juice1 = position.Position_Juice1;

// Main Model
let japanese_road;

/**
 * Lights
 */
// Light: Phone
{
    const spot_light_phone = new THREE.SpotLight(
        0x737eb9,
        3,
        2,
        Math.PI / 3,
        1,
        2
    );
    spot_light_phone.position.copy(Light_phone);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(Light_phone.x, Light_phone.y - 1, Light_phone.z);
    spot_light_phone.target = targetObject;

    scene.add(spot_light_phone);
    scene.add(spot_light_phone.target);
}

// Light: Road
{
    const spot_light_road = new THREE.SpotLight(
        0x737eb9,
        5,
        10,
        Math.PI / 3,
        1,
        2
    );
    spot_light_road.position.copy(Light_Road);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(Light_Road.x, Light_Road.y - 1, Light_Road.z);
    spot_light_road.target = targetObject;

    spot_light_road.castShadow = true;
    scene.add(spot_light_road);
    scene.add(spot_light_road.target);
}

// Car Light: Yellow
for (let i = 0; i < Light_Car_Y.length; i++) {
    const spot_light_car_y = new THREE.SpotLight(
        0xa7a438,
        3,
        20,
        Math.PI / 3,
        0.3,
        1
    );
    spot_light_car_y.position.copy(Light_Car_Y[i]);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(
        Light_Car_Y[i].x + 1,
        Light_Car_Y[i].y,
        Light_Car_Y[i].z
    );
    spot_light_car_y.target = targetObject;

    scene.add(spot_light_car_y);
    scene.add(spot_light_car_y.target);
}

// Car Light: White
for (let i = 0; i < Light_Car_W.length; i++) {
    const spot_light_car_w = new THREE.SpotLight(
        0x737eb9,
        4,
        30,
        Math.PI / 3,
        0.3,
        2
    );
    spot_light_car_w.position.copy(Light_Car_W[i]);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(
        Light_Car_W[i].x + 1,
        Light_Car_W[i].y,
        Light_Car_W[i].z
    );
    spot_light_car_w.target = targetObject;

    scene.add(spot_light_car_w);
    scene.add(spot_light_car_w.target);
}

// Light: Left Facia
for (let i = 0; i < Light_LeftTitle.length; i++) {
    const spot_light_lefttitle = new THREE.SpotLight(
        0xffffdd,
        10,
        2,
        Math.PI / 5,
        1,
        2
    );
    spot_light_lefttitle.position.copy(Light_LeftTitle[i]);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(
        Light_LeftTitle[i].x - 3,
        Light_LeftTitle[i].y - 5,
        Light_LeftTitle[i].z
    );
    spot_light_lefttitle.target = targetObject;

    scene.add(spot_light_lefttitle);
    scene.add(spot_light_lefttitle.target);
}

// Light: Right Facia
for (let i = 0; i < Light_RightTitle.length - 2; i++) {
    const spot_light_righttitle = new THREE.SpotLight(
        0xdddddd,
        10,
        3,
        Math.PI / 5,
        1,
        2
    );
    spot_light_righttitle.position.copy(Light_RightTitle[i]);

    if (i % 2 == 0) {
        const targetObject = new THREE.Object3D();
        targetObject.position.copy(Light_RightTitle[4]);
        spot_light_righttitle.target = targetObject;
    } else {
        const targetObject = new THREE.Object3D();
        targetObject.position.copy(Light_RightTitle[5]);
        spot_light_righttitle.target = targetObject;
    }

    spot_light_righttitle.castShadow = true;
    scene.add(spot_light_righttitle);
    scene.add(spot_light_righttitle.target);
}

// Light: Juice
for (let i = 0; i < Light_Juice.length; i++) {
    const spot_light_juice = new THREE.SpotLight(0x959fda, 5, 1, Math.PI / 2);
    spot_light_juice.position.copy(Light_Juice[i]);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(
        Light_Juice[i].x,
        Light_Juice[i].y - 1,
        Light_Juice[i].z
    );
    spot_light_juice.target = targetObject;

    spot_light_juice.castShadow = true;
    scene.add(spot_light_juice);
    scene.add(spot_light_juice.target);
}

// Light: Room
for (let i = 0; i < Light_Room.length; i++) {
    const spot_light_room = new THREE.SpotLight(
        0x737eb9,
        10,
        8,
        Math.PI / 2,
        1,
        2
    );
    spot_light_room.position.copy(Light_Room[i]);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(
        Light_Room[i].x,
        Light_Room[i].y - 1,
        Light_Room[i].z
    );
    spot_light_room.target = targetObject;
    scene.add(spot_light_room);
    scene.add(spot_light_room.target);
}

// Light: Street Lamp
for (let i = 0; i < Light_StreetLamp.length; i++) {
    const spot_light_streetlamp = new THREE.SpotLight(
        0x737eb9,
        4,
        80,
        Math.PI / 2,
        1,
        2
    );
    spot_light_streetlamp.position.copy(Light_StreetLamp[i]);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(
        Light_StreetLamp[i].x,
        Light_StreetLamp[i].y - 1,
        Light_StreetLamp[i].z
    );
    spot_light_streetlamp.target = targetObject;
    spot_light_streetlamp.castShadow = true;
    scene.add(spot_light_streetlamp);
    scene.add(spot_light_streetlamp.target);
}

// Light: Advertises
for (let i = 0; i < Light_ad.length; i++) {
    const pointLight = new THREE.PointLight(0x737eb9, 2, 5);
    pointLight.position.copy(Light_ad[i]);
    scene.add(pointLight);
}

/**
 * Models
 */
// Loading Bar
const manager = new THREE.LoadingManager();
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    document.querySelector(".progressbar").style.width =
        (itemsLoaded / itemsTotal) * 100 + "%";
    if (itemsLoaded === itemsTotal) {
        document.querySelector(".progress").style.opacity = 1;
        document.querySelector("#blocker").style.opacity = 1;
        gsap.to(document.querySelector(".progress").style, {
            opacity: 0,
            duration: 2,
            delay: 0.5,
        });
        gsap.to(document.querySelector("#blocker").style, {
            opacity: 0,
            duration: 2,
            delay: 0.5,
        });

        setTimeout(() => {
            document.querySelector(".progress").remove();
            document.querySelector("#blocker").remove();
        }, 10000);
    }
};
manager.on;

// Draco
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

// GLTF Loader
const gltfLoader = new GLTFLoader(manager);
gltfLoader.setDRACOLoader(dracoLoader);

// Load main model
gltfLoader.load("/models/main.glb", (gltf) => {
    japanese_road = gltf.scene;
    japanese_road.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    // Hide Position getting objects
    for (let i = 0; i < japanese_road.children.length; i++) {
        const child = japanese_road.children[i];
        if (child.name.startsWith("Position_")) {
            child.visible = false;
        }
        if (
            child.name == "Cube051" ||
            child.name == "0(17)009" ||
            child.name == "Plane003" ||
            child.name == "Cube179" ||
            child.name ==
                "4ffa09e45279eb6eefa3b2cf85fc2c9e-lines-scale-2_00x-gigapixe001" ||
            child.name == "Cube085"
        ) {
            child.traverse((child) => {
                if (child.material) {
                    child.material.side = THREE.FrontSide;
                }
            });
        }
    }

    scene.add(japanese_road);
});

/**
 * Action
 */

window.addEventListener("click", (event) => {    
    if (pointedObject.name == "Cube085") { // Phone
        gsap.to(camera.position, {
            duration: 1,
            x: Position_phone.x,
            y: Position_phone.y,
            z: Position_phone.z,
        });
        gsap.to(orbitControls.target, {
            duration: 1,
            x: Position_phone.x - 1,
            y: Position_phone.y,
            z: Position_phone.z,
        });
    }
    if (
        pointedObject.name == "0(17)009" ||
        pointedObject.name == "Plane002_3"
    ) { // Storage
        gsap.to(camera.position, {
            duration: 1,
            x: Position_storage.x,
            y: Position_storage.y,
            z: Position_storage.z,
        });
        gsap.to(orbitControls.target, {
            duration: 1,
            x: Position_storage.x - 1,
            y: Position_storage.y,
            z: Position_storage.z,
        });
        gsap.to(camera.position, {
            duration: 2,
            delay: 1,
            x: Position_storage.x - 3,
            y: Position_storage.y,
            z: Position_storage.z,
        });
        gsap.to(orbitControls.target, {
            duration: 2,
            delay: 1,
            x: Position_storage.x - 4,
            y: Position_storage.y,
            z: Position_storage.z,
        });
    }
    if (pointedObject.name == "Cube006") { // Juice2
        gsap.to(camera.position, {
            duration: 1,
            x: Position_Juice2.x,
            y: Position_Juice2.y,
            z: Position_Juice2.z,
        });
        gsap.to(orbitControls.target, {
            duration: 1,
            x: Position_Juice2.x - 1,
            y: Position_Juice2.y,
            z: Position_Juice2.z,
        });
    }
    if (pointedObject.name == "Cube097" || pointedObject.name == "Slice002") { // Juice1
        gsap.to(camera.position, {
            duration: 1,
            x: Position_Juice1.x,
            y: Position_Juice1.y,
            z: Position_Juice1.z,
        });
        gsap.to(orbitControls.target, {
            duration: 1,
            x: Position_Juice1.x - 1,
            y: Position_Juice1.y,
            z: Position_Juice1.z,
        });
    }
});
window.addEventListener("pointermove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        gsap.to(camera.position, {
            duration: 1,
            x: 5,
            y: 5,
            z: -5,
        });
        gsap.to(orbitControls.target, {
            duration: 1,
            x: 0,
            y: 0,
            z: 0,
        });
    }
  });

// Auto Resize
window.addEventListener("resize", () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animate
 */
const animate = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        pointedObject = intersects[0].object.parent;
    }

    try {
        if (
            pointedObject.name == "Cube085" ||
            pointedObject.name == "0(17)009" ||
            pointedObject.name == "Plane002_3" ||
            pointedObject.name == "Cube006" ||
            pointedObject.name == "Cube097" ||
            pointedObject.name == "Slice002"
        ) {
            canvas.style.cursor = "pointer";
        } else {
            canvas.style.cursor = "default";
        }
    } catch {}

    // Update controls
    orbitControls.update();

    // Render Scene
    renderer.render(scene, camera);

    // Call animate again on the next frame
    window.requestAnimationFrame(animate);
};

animate();
