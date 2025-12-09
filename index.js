// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";

let wid = 1280; // window.innerWidth;
let ht = 720; // window.innerHeight;
let renderer = new T.WebGLRenderer({preserveDrawingBuffer:true});
renderer.setSize(wid, ht);
renderer.shadowMap.enabled = true;

document.getElementById("game_area").appendChild(renderer.domElement);
renderer.domElement.id = "canvas";

const elementLevel = document.getElementById("level");
const elementScore = document.getElementById("score");
const elementHighScore = document.getElementById("highscore");
const elementMarque = document.getElementById("marque");

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

let silverMat = new T.MeshStandardMaterial({
  color: "silver",
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
  roughness: 0.9,
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
let fishSize = [];
let fishVel = [];
let fishVelAcum = [];
let urchins = [];
let gbubbles = [];
let sbubbles = [];

const maxBubbles = 16;
const bubble_obj = new T.Mesh(new T.SphereGeometry(1.0), goldMat);
for (let i = 0; i < maxBubbles; i++) {
	gbubbles.push(bubble_obj.clone());
	gbubbles[i].material = goldMat;
	gbubbles[i].position.set(0, 0, 0); 
	
	sbubbles.push(bubble_obj.clone());
	sbubbles[i].material = silverMat;
	sbubbles[i].position.set(0, 0, 0); 
}


const maxUrchin = 16;
//urchin
let urchin_obj = await loader.loadAsync("objs/urchin.obj");
urchin_obj.traverse(obj => {
    if (obj instanceof T.Mesh) {
		obj.castShadow = true;
		obj.scale.set(2.0, 2.0, 2.0);
		for (let i = 0; i < maxUrchin; i++) {
			urchins.push(obj.clone());
			urchins[i].material = urchinMat;
			urchins[i].position.set(0, 0, 0); 
		}
    }
});


const maxFish = 17;
// fish head
let fishhead_obj = await loader.loadAsync("objs/fish_head.obj");
fishhead_obj.traverse(obj => {
    if (obj instanceof T.Mesh) {
		obj.castShadow = true;
		for (let i = 0; i < maxFish; i++) {
			fish.push(obj.clone());
			fish[i].material = fishMat.clone();				
			fish[i].position.set(0, 0, 0); 
			fishSize.push(1.0);
			fishVel.push(new T.Vector3(0,0,0));
			fishVelAcum.push(new T.Vector3(0,0,0));
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
let player_highscore = 0;
let player_level = 1;
let level_state = 2;
let gameover = 0;

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
	' ': false,
	enter: false,
	arrowleft: false,
	arrowright: false
};

let active_fish_ids = [];
let active_urchin_ids = [];
let active_gbubble_ids = [];
let active_sbubble_ids = [];

function fishLogic(timeDelta, timestamp) {
	
	switch(level_state){
		
		case 0:
			player_size = 1;
			level_state = 1;
			
			//reset fishes
			fish[0].position.set(0,0,0);
			for (let i = 0; i < active_fish_ids.length; i++){
				scene.remove(fish[active_fish_ids[i]])
			}
			active_fish_ids = [];
			
			for (let i = 0; i < active_urchin_ids.length; i++){
				scene.remove(urchins[active_urchin_ids[i]])
			}
			active_urchin_ids = [];
			
			for (let i = 0; i < active_gbubble_ids.length; i++){
				scene.remove(gbubbles[active_gbubble_ids[i]])
			}
			active_gbubble_ids = [];
			
			for (let i = 0; i < active_sbubble_ids.length; i++){
				scene.remove(sbubbles[active_sbubble_ids[i]])
			}
			active_sbubble_ids = [];
			
			console.log(active_fish_ids.length)
			
			break;
		
		
		case 1:
			
			if(player_size > 5) level_state = 3;
			
			//-----------------------------------------------------------------------------
			//add fish
			if(Math.random() < 0.025 * player_level && active_fish_ids.length < 16){
				//spawn urchin
				let chosenId = -1;
				for(let i = 1; i < 17; i++)
				if(!active_fish_ids.includes(i)){
					chosenId = i;
					break;
				}
				if(chosenId != -1){
					active_fish_ids.push(chosenId);
					scene.add(fish[chosenId]);
					
					fishSize[chosenId] = 0.5 + Math.random() * 1.125 * player_level;
					
					fishVel[chosenId].x = Math.random() * 2.0 - 1.0;
					fishVel[chosenId].y = Math.random() * 2.0 - 1.0;
					fishVel[chosenId].z = Math.random() * 2.0 - 1.0;
					
					fish[chosenId].position.set(Math.random() * 48.0 - 24.0, Math.random() * 48.0 - 24.0, Math.random() * 48.0 - 24.0);
				}
			}
			
			
			//fish logic
			for(let i = 0; i < active_fish_ids.length; i++){
				
				//boid behavior
				//adopted from my workbook 4 submission
				let alignX = fishVel[active_fish_ids[i]].x;
				let alignY = fishVel[active_fish_ids[i]].y;
				let alignZ = fishVel[active_fish_ids[i]].z;
				
				let avoidX = fishVel[active_fish_ids[i]].x;
				let avoidY = fishVel[active_fish_ids[i]].y;
				let avoidZ = fishVel[active_fish_ids[i]].z;
				
				let adhereX = fishVel[active_fish_ids[i]].x;
				let adhereY = fishVel[active_fish_ids[i]].y;
				let adhereZ = fishVel[active_fish_ids[i]].z;
				
				let normalizer = 1.0;
				for(let j = 0; j < active_fish_ids.length; j++){
					if(i == j) continue;
					
					let distX = fish[active_fish_ids[j]].position.x - fish[active_fish_ids[i]].position.x;
					let distY = fish[active_fish_ids[j]].position.y - fish[active_fish_ids[i]].position.y;
					let distZ = fish[active_fish_ids[j]].position.z - fish[active_fish_ids[i]].position.z;
					
					let mag = Math.sqrt(distX * distX + distY * distY + distZ * distZ);
					let imag = 1.0 / mag;
					
					let nearness = 1.0 - (Math.max(0, 4.0 - mag) / 4.0);
					
					adhereX += distX * imag * nearness;
					adhereY += distY * imag * nearness;
					adhereZ += distZ * imag * nearness;
					avoidX  += -distX * imag * nearness;
					avoidY  += -distY * imag * nearness;
					avoidZ  += -distZ * imag * nearness;
					alignX  += fishVel[active_fish_ids[j]].x * nearness;
					alignY  += fishVel[active_fish_ids[j]].y * nearness;
					alignZ  += fishVel[active_fish_ids[j]].z * nearness;
					normalizer += nearness;
					
				}
				normalizer = 1.0 / normalizer;
				alignX *= normalizer;
				alignY *= normalizer;
				alignZ *= normalizer;
				avoidX *= normalizer;
				avoidY *= normalizer;
				avoidZ *= normalizer;
				adhereX *= normalizer;
				adhereY *= normalizer;
				adhereZ *= normalizer;
				
				let avoidAmount = 0.24;
				let adhereAmount = 0.22;
				let alignAmount = 0.12;
				
				let bigFish = Math.round(Math.max(0, Math.min(3, player_size - 1))) < Math.round(Math.max(0, Math.min(3, fishSize[active_fish_ids[i]] - 1)));
				
				if(bigFish){
					const fishPosition = new T.Vector3();
					fishPosition.copy(fish[0].position).sub(fish[active_fish_ids[i]].position)
					
					let dist = fishPosition.length();
					
					if(dist < 12.0){
						fishPosition.normalize();
						
						let effect = Math.min(0.635, player_level / 4.0);
						
						alignX = alignX * (1.0 - effect) + fishPosition.x * effect;
						alignY = alignY * (1.0 - effect) + fishPosition.y * effect;
						alignZ = alignZ * (1.0 - effect) + fishPosition.z * effect;
					}
				}
				
				fishVel[active_fish_ids[i]].x = fishVel[active_fish_ids[i]].x * (1.0 - adhereAmount - alignAmount - avoidAmount) + alignX * alignAmount + avoidX * avoidAmount + adhereX * adhereAmount;
				fishVel[active_fish_ids[i]].y = fishVel[active_fish_ids[i]].y * (1.0 - adhereAmount - alignAmount - avoidAmount) + alignY * alignAmount + avoidY * avoidAmount + adhereY * adhereAmount;
				fishVel[active_fish_ids[i]].z = fishVel[active_fish_ids[i]].z * (1.0 - adhereAmount - alignAmount - avoidAmount) + alignZ * alignAmount + avoidZ * avoidAmount + adhereZ * adhereAmount;
				
				fishVel[active_fish_ids[i]].normalize();
				
				//wall collison
				if(fish[active_fish_ids[i]].position.length() > 24.0){
					fishVel[active_fish_ids[i]].x = -fishVel[active_fish_ids[i]].x;
					fishVel[active_fish_ids[i]].y = -fishVel[active_fish_ids[i]].y;
					fishVel[active_fish_ids[i]].z = -fishVel[active_fish_ids[i]].z;
					
					const fishPosition = new T.Vector3();
					fishPosition.copy(fish[active_fish_ids[i]].position).normalize().multiplyScalar(24.0)
					
					fish[active_fish_ids[i]].position.set(fishPosition.x, fishPosition.y, fishPosition.z);
				}
				
				const velAdd = new T.Vector3();
				velAdd.copy(fishVel[active_fish_ids[i]]).multiplyScalar(0.1);
				
				const targetPosition = new T.Vector3();
				const targetVector = new T.Vector3();
				targetVector.copy(velAdd).normalize();
				targetPosition.copy(fish[active_fish_ids[i]].position).add(targetVector);
				
				fish[active_fish_ids[i]].lookAt(targetPosition);
				
				fish[active_fish_ids[i]].position.add(velAdd);
				
				//fish eats/is eaten
				const dist = new T.Vector3();
				if( dist.copy(fish[active_fish_ids[i]].position).sub(fish[0].position).length() < 1.125 * 0.75 * Math.max(fishSize[active_fish_ids[i]], player_size) ){
					if( bigFish ){
						level_state = 2;
						return;
					}else{
						player_size += fishSize[active_fish_ids[i]] * 0.25;
						player_score += 100 * fishSize[active_fish_ids[i]];
						scene.remove(fish[active_fish_ids[i]])
						active_fish_ids.splice(i, 1);
					}
				}
			}
			//-----------------------------------------------------------------------------
			
			
			//-----------------------------------------------------------------------------
			//add silver bubbles
			if(Math.random() < 0.01 / Math.max(1.0, player_level / 4.0) && active_sbubble_ids.length < 16){
				let chosenId = -1;
				for(let i = 0; i < 16; i++)
				if(!active_sbubble_ids.includes(i)){
					chosenId = i;
					break;
				}
				if(chosenId != -1){
					active_sbubble_ids.push(chosenId);
					scene.add(sbubbles[chosenId]);
					sbubbles[chosenId].position.set(Math.random() * 48.0 - 24.0, -30.0, Math.random() * 48.0 - 24.0);
				}
			}
			
			//silver logic
			for(let i = 0; i < active_sbubble_ids.length; i++){
				sbubbles[active_sbubble_ids[i]].position.y += timeDelta * 5.0;
				//add points
				const dist = new T.Vector3();
				if( dist.copy(sbubbles[active_sbubble_ids[i]].position).sub(fish[0].position).length() < Math.max(2.0, 1.75 * 0.75 * player_size) ){
					player_score += 100 * player_level;
					player_size += 0.05 * player_level;
					scene.remove(sbubbles[active_sbubble_ids[i]])
					active_sbubble_ids.splice(i, 1);
				}
				//reset bubbles
				else if(sbubbles[active_sbubble_ids[i]].position.y > 30.0){
					scene.remove(sbubbles[active_sbubble_ids[i]])
					active_sbubble_ids.splice(i, 1);
				}
			}
			//-----------------------------------------------------------------------------
			
			//-----------------------------------------------------------------------------
			//add gold bubbles
			if(Math.random() < 0.005 / Math.max(1.0, player_level / 4.0) && active_gbubble_ids.length < 16){
				let chosenId = -1;
				for(let i = 0; i < 16; i++)
				if(!active_gbubble_ids.includes(i)){
					chosenId = i;
					break;
				}
				if(chosenId != -1){
					active_gbubble_ids.push(chosenId);
					scene.add(gbubbles[chosenId]);
					gbubbles[chosenId].position.set(Math.random() * 48.0 - 24.0, -30.0, Math.random() * 48.0 - 24.0);
				}
			}
			
			//gold bubbles logic
			for(let i = 0; i < active_gbubble_ids.length; i++){
				gbubbles[active_gbubble_ids[i]].position.y += timeDelta * 5.0;
				//add points
				const dist = new T.Vector3();
				if( dist.copy(gbubbles[active_gbubble_ids[i]].position).sub(fish[0].position).length() < Math.max(2.0, 1.75 * 0.75 * player_size) ){
					player_score += 500 * player_level;
					player_size += 0.1 * player_level;
					scene.remove(gbubbles[active_gbubble_ids[i]])
					active_gbubble_ids.splice(i, 1);
				}
				//reset bubbles
				else if(gbubbles[active_gbubble_ids[i]].position.y > 30.0){
					scene.remove(gbubbles[active_gbubble_ids[i]])
					active_gbubble_ids.splice(i, 1);
				}
			}
			//-----------------------------------------------------------------------------
			
			
			//-----------------------------------------------------------------------------
			//add urchins
			if(Math.random() < 0.005 * player_level && active_urchin_ids.length < 16){
				//spawn urchin
				let chosenId = -1;
				for(let i = 0; i < 16; i++)
				if(!active_urchin_ids.includes(i)){
					chosenId = i;
					break;
				}
				if(chosenId != -1){
					active_urchin_ids.push(chosenId);
					scene.add(urchins[chosenId]);
					
					urchins[chosenId].position.set(Math.random() * 48.0 - 24.0, -30.0, Math.random() * 48.0 - 24.0);
				}
			}
			
			//urchin logic
			for(let i = 0; i < active_urchin_ids.length; i++){
				
				urchins[active_urchin_ids[i]].position.y += timeDelta * 10.0;
				
				urchins[active_urchin_ids[i]].rotation.x = Math.sin(timestamp * 0.01);
				urchins[active_urchin_ids[i]].rotation.y = Math.cos(timestamp * 0.01);
				urchins[active_urchin_ids[i]].rotation.z = Math.cos(timestamp * 0.01);
				
				//urchin kills player
				const dist = new T.Vector3();
				if( dist.copy(urchins[active_urchin_ids[i]].position).sub(fish[0].position).length() < Math.max(2.0, 1.125 * 0.75 * player_size) ){
					level_state = 2;
					return;
				}
				
				//reset urchin
				if(urchins[active_urchin_ids[i]].position.y > 30.0){
					scene.remove(urchins[active_urchin_ids[i]])
					active_urchin_ids.splice(i, 1);
				}
			}
			//-----------------------------------------------------------------------------
			
			break;
		
		case 2:
			//game over
			gameover = 1;
			player_level = 1;
			player_score = 0;
			scene.remove(fish[0]);
			
			elementMarque.innerHTML = " GameOver: Press ENTER to replay ";
			
			if(keys.enter == true){
				scene.add(fish[0]);
				gameover = 0;
				level_state = 0;
				elementMarque.innerHTML = " GO: Green < Yellow < Orange < Red ";
			}
			
			break;
		
		case 3:
			//new level
			level_state = 0;
			player_level += 1;
			break;
	}
	
}
//-----------------------------------------------------------------------------





//-----------------------------------------------------------------------------
let main_camera = new T.PerspectiveCamera(60, wid / ht, 1, 100);
main_camera.position.set(0, 10, 10);
main_camera.lookAt(0, 0, 0);

//let othercam = new T.PerspectiveCamera();

//let controls = new OrbitControls(main_camera, renderer.domElement);
//-----------------------------------------------------------------------------



//-----------------------------------------------------------------------------
renderer.render(scene, main_camera);

let vel = new T.Vector3(0, 0, 0);
let camvel = new T.Vector3(0, 0, 0);
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
	
	if(gameover == false){
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
			vel.y += 0.05;
		
		
		if(vel.length() > 0.25)
			vel.normalize().multiplyScalar(0.25);
		
		const targetPosition = new T.Vector3();
		const targetVector = new T.Vector3();
		targetVector.copy(vel).normalize();
		targetPosition.copy(fish[0].position).add(targetVector);
		
		fish[0].lookAt(targetPosition);
		
		fish[0].position.add(vel);
		vel.multiplyScalar(1.0 - timeDelta * 6.0);
		
		
		if(fish[0].position.length() > 24.5){
			const fishPosition = new T.Vector3();
			fishPosition.copy(fish[0].position).normalize().multiplyScalar(24.5)
			
			fish[0].position.set(fishPosition.x, fishPosition.y, fishPosition.z);
		}
		
		let dir = new T.Vector3(main_camera.position.x - fish[0].position.x, 0.0, main_camera.position.z - fish[0].position.z);
		let k = dir.length();
		
		k -= 12.0;
		k *= 0.05;
		k *= k * k;
		
		dir.multiplyScalar(k);
		
		dir.y = main_camera.position.y - fish[0].position.y;
		dir.y -= 6.0;
		dir.y *= 0.1;
		dir.y *= dir.y * dir.y;
		
		main_camera.position.sub(dir);
		main_camera.lookAt(fish[0].position);
	
		camvel.copy(right).multiplyScalar(50.0);
		
		if (keys.arrowleft)
			main_camera.position.add(camvel);
		if (keys.arrowright)
			main_camera.position.sub(camvel);
		
		
		if(main_camera.position.length() > 24.5){
			const fishPosition = new T.Vector3();
			fishPosition.copy(main_camera.position).normalize().multiplyScalar(24.5)
			
			main_camera.position.set(fishPosition.x, fishPosition.y, fishPosition.z);
		}
		
	}
	
	
	// do fish logic
	fishLogic(timeDelta, timestamp);
	
	
	const colorTable = ["green", "yellow", "orange", "red"];
	
	// main fish
	{	let speedup = 1.0;
		speedup = vel.length() * 4.0;
		
		fish[0].scale.set(player_size * 0.75, player_size * 0.75, player_size * 0.75);
		
		let sizeIndex = Math.round(Math.max(0, Math.min(3, player_size - 1)));
		
		fish[0].material.color.set( colorTable[sizeIndex] );
		fish[0].material.needsUpdate = true;
		
		fish[0].children[0].rotation.y = Math.sin(timestamp * 0.01) * 0.5 * speedup;
		fish[0].children[0].children[0].rotation.y = Math.cos(timestamp * 0.01) * 0.5 * speedup;
	}
	
	// animate other fish
	for(let i = 0; i < active_fish_ids.length; i++){
		
		let fish_size = fishSize[active_fish_ids[i]];
		
		fish[active_fish_ids[i]].scale.set(fish_size * 0.75, fish_size * 0.75, fish_size * 0.75);
		
		let sizeIndex = Math.round(Math.max(0, Math.min(3, fish_size - 1)));
		
		fish[active_fish_ids[i]].material.color.set( colorTable[sizeIndex] );
		
		fish[active_fish_ids[i]].children[0].rotation.y = Math.sin(timestamp * 0.01) * 0.5;
		fish[active_fish_ids[i]].children[0].children[0].rotation.y = Math.cos(timestamp * 0.01) * 0.5;
	}
	
	
	// Change its content
	elementLevel.innerHTML = player_level.toString();
	elementScore.innerHTML = Math.round(player_score).toString();
	elementHighScore.innerHTML = Math.round(player_highscore).toString();
	
	if(player_score > player_highscore) player_highscore = player_score;
	
	
	// draw and loop
	renderer.render(scene, main_camera);
	window.requestAnimationFrame(animate);
}

window.addEventListener('keydown', (event) => {
    // Convert key to lowercase for consistency
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

window.requestAnimationFrame(animate);


