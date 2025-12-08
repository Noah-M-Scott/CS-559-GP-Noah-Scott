// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";

let wid = 670; // window.innerWidth;
let ht = 500; // window.innerHeight;
let renderer = new T.WebGLRenderer({preserveDrawingBuffer:true});
renderer.setSize(wid, ht);
renderer.shadowMap.enabled = true;

document.getElementById("game_area").appendChild(renderer.domElement);
renderer.domElement.id = "canvas";

let scene = new T.Scene();
scene.background = new T.Color(0x0022AA);
let amb_light = new T.AmbientLight(0xffffff, 0.25);
scene.add(amb_light);

const directionalLight = new T.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);
//-----------------------------------------------------------------------------



//-----------------------------------------------------------------------------
let column = new T.TextureLoader().load("textures/column.png", function ( texture ) {texture.wrapS = T.RepeatWrapping; texture.wrapT = T.RepeatWrapping;});
let fishSkin = new T.TextureLoader().load("textures/fishSkin.png", function ( texture ) {texture.wrapS = T.RepeatWrapping; texture.wrapT = T.RepeatWrapping;});
let sand = new T.TextureLoader().load("textures/sand.png", function ( texture ) {texture.wrapS = T.RepeatWrapping; texture.wrapT = T.RepeatWrapping;});
let seaweed = new T.TextureLoader().load("textures/seaweed.png", function ( texture ) {texture.wrapS = T.RepeatWrapping; texture.wrapT = T.RepeatWrapping;});
let tiles = new T.TextureLoader().load("textures/tiles.png", function ( texture ) {texture.wrapS = T.RepeatWrapping; texture.wrapT = T.RepeatWrapping;});
let urchin = new T.TextureLoader().load("textures/urchin.png", function ( texture ) {texture.wrapS = T.RepeatWrapping; texture.wrapT = T.RepeatWrapping;});

let goldMat = new T.MeshStandardMaterial({
  color: "gold",
  roughness: 0.01
});

let fishMat = new T.MeshStandardMaterial({
  color: "green",
  roughness: 0.5,
  side: T.DoubleSide,
  map: fishSkin
});

let tileMat = new T.MeshStandardMaterial({
  color: "white",
  roughness: 0.5,
  side: T.DoubleSide,
  map: tiles
});

let seaweedMat = new T.MeshStandardMaterial({
  color: "white",
  roughness: 0.5,
  side: T.DoubleSide,
  map: seaweed
});

let urchinMat = new T.MeshStandardMaterial({
  color: "white",
  roughness: 0.5,
  side: T.DoubleSide,
  map: urchin
});

let columnMat = new T.MeshStandardMaterial({
  color: "white",
  roughness: 0.2,
  side: T.DoubleSide,
  map: column
});

let sandMat = new T.MeshStandardMaterial({
  color: "white",
  roughness: 1.0,
  side: T.DoubleSide,
  map: sand
});
//-----------------------------------------------------------------------------




//-----------------Level Stuff-------------------------------------------------
// sand
let loader = new OBJLoader();
let sand_obj = await loader.loadAsync("objs/level_sand.obj");
sand_obj.traverse(obj => {
        if (obj instanceof T.Mesh) {
            obj.material = sandMat;
			obj.castShadow = true;
        }
    });
sand_obj.scale.set(1, 1, 1);
sand_obj.position.set(0, 0, 0);
scene.add(sand_obj);

// seaweed
let seaweed_obj = await loader.loadAsync("objs/level_seaweed.obj");
seaweed_obj.traverse(obj => {
        if (obj instanceof T.Mesh) {
            obj.material = seaweedMat;
			obj.castShadow = true;
        }
    });
seaweed_obj.scale.set(1, 1, 1);
seaweed_obj.position.set(0, 0, 0);
scene.add(seaweed_obj);

// column
let column_obj = await loader.loadAsync("objs/level_columns.obj");
column_obj.traverse(obj => {
        if (obj instanceof T.Mesh) {
            obj.material = columnMat;
			obj.castShadow = true;
        }
    });
column_obj.scale.set(1, 1, 1);
column_obj.position.set(0, 0, 0);
scene.add(column_obj);

// tiles
let tiles_obj = await loader.loadAsync("objs/level_tiles.obj");
tiles_obj.traverse(obj => {
        if (obj instanceof T.Mesh) {
            obj.material = tileMat;
			obj.castShadow = true;
        }
    });
tiles_obj.scale.set(1, 1, 1);
tiles_obj.position.set(0, 0, 0);
scene.add(tiles_obj);
//-----------------------------------------------------------------------------





//-----------------Level Stuff-------------------------------------------------
let fish = [];
let urchins = [];
let gbubbles = [];
let sbubbles = [];

const maxFish = 16;

// fish head
let fishhead_obj = await loader.loadAsync("objs/fish_head.obj");
fishhead_obj.traverse(obj => {
    if (obj instanceof T.Mesh) {
		obj.castShadow = true;
		for (let i = 0; i < maxFish; i++) {
			fish.push(obj.clone());
			fish[i].material = fishMat.clone();				
			fish[i].position.set(0, 0, 0); 
		}
    }
});


// fish body
let fishbody_obj = await loader.loadAsync("objs/fish_middle.obj");
fishbody_obj.traverse(obj => {
    if (obj instanceof T.Mesh) {
		obj.castShadow = true;
		for (let i = 0; i < maxFish; i++) {
			const k = obj.clone();
			k.material = fish[i].material;				
			k.position.set(0, 0, 0);
			fish[i].add(k);
		}
    }
});


// fish tail
let fishtail_obj = await loader.loadAsync("objs/fish_tail.obj");
fishtail_obj.traverse(obj => {
    if (obj instanceof T.Mesh) {
		obj.castShadow = true;
		for (let i = 0; i < maxFish; i++) {
			const k = obj.clone();
			k.material = fish[i].material;				
			k.position.set(0, 0, -1.08);
			fish[i].children[0].add(k);
		}
    }
});


fish[0].scale.set(1, 1, 1);
fish[0].position.set(0, 0, 0);
scene.add(fish[0]);
//-----------------------------------------------------------------------------



//-----------------------------------------------------------------------------
let player_size = 1;
let player_score = 0;
let active_fish = 1;
let active_urchin = 0;
let active_gbubble = 0;
let active_sbubble = 0;

function fishLogic() {
	
	
	
}
//-----------------------------------------------------------------------------





//-----------------------------------------------------------------------------
let main_camera = new T.PerspectiveCamera(60, wid / ht, 1, 100);
main_camera.position.set(0, 10, 10);
main_camera.lookAt(0, 0, 0);

let othercam = new T.PerspectiveCamera();

let controls = new OrbitControls(main_camera, renderer.domElement);
//-----------------------------------------------------------------------------



//-----------------------------------------------------------------------------
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
	' ': false,
	click: false
};

renderer.render(scene, main_camera);

let vel = new T.Vector3(0, 0, 0);
let lastTimestamp;
function animate(timestamp) {
	let timeDelta = 1.0 / 60.0;//0.001 * (lastTimestamp ? timestamp - lastTimestamp : 0);
	lastTimestamp = timestamp;
	
	
	let forward = new T.Vector3(0, 0, -1);
	forward.applyQuaternion(main_camera.quaternion);
	forward.y = 0.0;
	forward.normalize();
	forward.x *= timeDelta;
	forward.z *= timeDelta;
	
	
	let right = new T.Vector3(-1, 0, 0);
	right.applyQuaternion(main_camera.quaternion);
	right.y = 0.0;
	right.normalize();
	right.x *= timeDelta;
	right.z *= timeDelta;	
	
	vel.y -= 0.01;
	
	
	if (keys.w)
		vel.add(forward);
	if (keys.s)
		vel.sub(forward);
	if (keys.a)
		vel.add(right);
	if (keys.d)
		vel.sub(right);
	if (keys[' '])
		vel.y += 0.02;
	
	
	if(vel.length() > 4.0)
		vel.normalize().multiplyScalar(4.0);
	
	const targetPosition = new T.Vector3();
	const targetVector = new T.Vector3();
	targetVector.copy(vel).normalize();
	targetPosition.copy(fish[0].position).add(targetVector);
	
	fish[0].lookAt(targetPosition);
	
	fish[0].position.add(vel);
	vel.multiplyScalar(1.0 - timeDelta * 8.0);
	
	
	if(fish[0].position.length() > 25.0){
		const fishPosition = new T.Vector3();
		fishPosition.copy(fish[0].position).normalize().multiplyScalar(25.0)
		
		fish[0].position.set(fishPosition.x, fishPosition.y, fishPosition.z);
	}
	
	
	if(keys['click'] == false){
		let dir = new T.Vector3(main_camera.position.x - fish[0].position.x, main_camera.position.y - fish[0].position.y, main_camera.position.z - fish[0].position.z);
		let k = dir.length();
		
		k -= 16.0;
		k *= 0.1;
		k *= k * k;
		
		controls.object = othercam;
		
		main_camera.position.sub(dir.multiplyScalar(k));
		main_camera.lookAt(fish[0].position);
		
		//controls.target.set(fish[0].position);
		controls.object = main_camera;
	}
	
	
	// do fish logic
	fishLogic();
	
	// animate fish
	for(let i = 0; i < active_fish; i++){
		let speedup = 1.0;
		if(i == 0) speedup = vel.length() * 8.0;
		
		fish[i].children[0].rotation.y = Math.sin(timestamp * 0.01) * 0.5 * speedup;
		fish[i].children[0].children[0].rotation.y = Math.cos(timestamp * 0.01) * 0.5 * speedup;
	}
	
	// draw and loop
	renderer.render(scene, main_camera);
	window.requestAnimationFrame(animate);
}

window.addEventListener('pointerdown', (event) => {
    // Convert key to lowercase for consistency
    keys['click'] = true;
});

window.addEventListener('pointerup', (event) => {
    // Convert key to lowercase for consistency
    keys['click'] = false;
});

window.addEventListener('keydown', (event) => {
    // Convert key to lowercase for consistency
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

window.requestAnimationFrame(animate);


