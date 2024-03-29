var canvas = document.getElementById("renderCanvas");

var scr_width = screen.width;

function get_max_val(arr) {
  var arrCopy = arr;

  var max  = Math.max.apply(null, arr);

  var max_index = arr.indexOf(max);

  arrCopy.splice(max_index, 1);

  var sec_max = Math.max.apply(null, arrCopy);

  var sec_max_idx = arr.indexOf(sec_max);

  return [max_index, sec_max_idx];
}

function get_emotion_color(emotion) {
  available_emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];

  emo_scores = [];

  for(emo in available_emotions){
    // console.log(emo)
    score = emotion[available_emotions[emo]];
    emo_scores.push(score);
  }
  idxs = get_max_val(emo_scores)

  colors_emo_map = [
    {'r': 0.8889087296526011, 'g': 0.2988565335988701, 'b': 0.07763453453475722},
    {'r': 0.7027016569409856, 'g': 0.3571351910021412, 'b': 0.9065863991822648},
    {'r': 0.9065863991822648, 'g': 0.7824799012882336, 'b': 0.9065863991822648},
    {'r': 0.06315211265975706, 'g': 0.5758608592745578, 'b': 0.9065863991822648},
    {'r': 0.015561667432201396, 'g': 0.45, 'b': 0.19947961799571723},
    {'r': 0.1962859478428038, 'g': 0.19947961799571723, 'b': 0},
    {'r': 0.4646446609406726, 'g': 0.4430585286555533, 'b': 0.4430585286555533}
  ];
  return [colors_emo_map[idxs[0]], colors_emo_map[idxs[1]]];
}

// Dr. Strange Effect
var createDrStrange = function() {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 300, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 100;

    var ws = new WebSocket('ws://localhost:9000');

    ws.onopen = function() {
        console.log('open');
    };

    x = 0;
    y = 0;

    var assetsManager = new BABYLON.AssetsManager(scene);
    var spellDiskTask = assetsManager.addMeshTask("spellDiskTask", null, "https://models.babylonjs.com/TrailMeshSpell/", "spellDisk.glb");
    var pinkEnergyBallTask = assetsManager.addMeshTask("pinkEnergyBall", null, "https://models.babylonjs.com/TrailMeshSpell/", "pinkEnergyBall.glb");
    var greenEnergyBallTask = assetsManager.addMeshTask("greenEnergyBall", null, "https://models.babylonjs.com/TrailMeshSpell/", "greenEnergyBall.glb");
    var yellowEnergyBallTask = assetsManager.addMeshTask("yellowEnergyBallTask", null, "https://models.babylonjs.com/TrailMeshSpell/", "yellowEnergyBall.glb");

    greenEnergy = null;
    pinkEnergy = null;
    yellowEnergy = null;
    spellDisk = null;

    spellDiskTask.onSuccess = function(task) {
        task.loadedMeshes.forEach(function(mesh) {
            if (mesh.name == "__root__") {
                spellDisk = mesh;
                mesh.name = "__spellDisk_root__";
                mesh.scaling.scaleInPlace(10);
                camera.lockedTarget = mesh;
            }
        });
    }
    pinkEnergyBallTask.onSuccess = function(task) {
        task.loadedMeshes.forEach(function(mesh) {
            if (mesh.name == "__root__") {
                pinkEnergy = mesh;
                mesh.name = "__pinkEnergyBall_root__";
            }
        });
    }
    greenEnergyBallTask.onSuccess = function(task) {
        task.loadedMeshes.forEach(function(mesh) {
            if (mesh.name == "__root__") {
                greenEnergy = mesh;
                mesh.name = "__greenEnergyBall_root__";
            }
        });
    }
    yellowEnergyBallTask.onSuccess = function(task) {
        task.loadedMeshes.forEach(function(mesh) {
            if (mesh.name == "__root__") {
                yellowEnergy = mesh;
                mesh.name = "__yellowEnergyBall_root__";
            }
        });
    }
    assetsManager.load();

    ws.onmessage = function(event) {
        var msg = JSON.parse(event.data);
        x = msg.x;
        y = msg.y;
        part = msg.part;
        emotion = msg.emotion;

        allowed_parts=['nose', 'Rwri', 'Lwri'];

        if (part == 'nose') {
            console.log(msg);
            spellDisk.position.x = x;
            spellDisk.position.z = y;

            pinkEnergy.position.x = x;
            pinkEnergy.position.z = y;

            if(x == 0 && y == 0) {
              location.reload();
            }
        }

        if (part == 'Rwri') {
            console.log(msg);
            yellowEnergy.position.x = spellDisk.position.x + (24 + (x / scr_width) * 100);
            yellowEnergy.position.z = spellDisk.position.z + (24 + (y / scr_width) * 100);
        }

        if (part == 'Lwri') {
            console.log(msg);
            greenEnergy.position.x = spellDisk.position.x - (24 + (x / scr_width) * 100);
            greenEnergy.position.z = spellDisk.position.z - (24 + (y / scr_width) * 100);
        }
    };

    return scene;
}

// Color Cube Rotation
var createSceneCube = function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black;
    var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, -0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 50, -200));
    camera.attachControl(canvas, true);

    var ws = new WebSocket('ws://localhost:9000');

    ws.onopen = function() {
        console.log('open');
    };

    x = 0;
    y = 0;

    var pl = new BABYLON.PointLight("pl", new BABYLON.Vector3(0, 0, 0), scene);
    pl.diffuse = new BABYLON.Color3(1, 1, 1);
    pl.intensity = 1.0;

    var nb = 160000; // nb of triangles
    var fact = 100; // cube size

    ws.onmessage = function(event) {
        var msg = JSON.parse(event.data);
        console.log(msg);
        x = msg.x;
        y = msg.y;

        nb = 1600 * (x + y);
        fact = 100 * (x + y);

        if (y == 0 && x == 0){
          location.reload();
        }
    };

    // custom position function for SPS creation
    var myPositionFunction = function(particle, i, s) {
        particle.position.x = (Math.random() - 0.5) * fact;
        particle.position.y = (Math.random() - 0.5) * fact;
        particle.position.z = (Math.random() - 0.5) * fact;
        particle.rotation.x = x * 3.15;
        particle.rotation.y = y * 3.15;
        particle.rotation.z = (x + y) * 1.5;
        particle.color = new BABYLON.Color4(particle.position.x / fact + 0.5, particle.position.y / fact + 0.5, particle.position.z / fact + 0.5, 1.0);
    };

    // model : triangle
    var triangle = BABYLON.MeshBuilder.CreateDisc("t", {
        tessellation: 3,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);
    var SPS = new BABYLON.SolidParticleSystem('SPS', scene, {
        updatable: true
    });
    SPS.addShape(triangle, nb, {
        positionFunction: myPositionFunction
    });
    var mesh = SPS.buildMesh();


    // dispose the model
    triangle.dispose();

    // SPS mesh animation
    scene.registerBeforeRender(function() {
        pl.position = camera.position;
        SPS.mesh.rotation.y += 0.01 * y;
        SPS.mesh.rotation.x += 0.01 * x;
    });

    return scene;
};

// GPU Particle Effect
var createSceneParticle = function() {
    var scene = new BABYLON.Scene(engine);
    var ws = new WebSocket('ws://localhost:9000');

    ws.onopen = function() {
        console.log('open');
    };

    x = 0;
    y = 0;

    // Setup environment
    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 100;

    var fountain = BABYLON.Mesh.CreateBox("foutain", 0.1, scene);
    fountain.visibility = 0.1;

    // Create a particle system
    var particleSystem;
    var useGPUVersion = true;

    ws.onmessage = function(event) {
        var msg = JSON.parse(event.data);
        x = msg.x;
        y = msg.y;

        console.log(msg)

        fountain.position.x = 5 * Math.cos(x);
        fountain.position.y = 5 * Math.sin(y);

        particleSystem.activeParticleCount = 2000 * (x + y);

        colors = get_emotion_color(msg.emotion);

        particleSystem['color2'] = colors[0]
        particleSystem['colorDead'] = colors[1]

        if(particleSystem.activeParticleCount == 0){
          location.reload();
        }
    };

    var createNewSystem = function() {
        if (particleSystem) {
            particleSystem.dispose();
        }

        if (useGPUVersion && BABYLON.GPUParticleSystem.IsSupported) {
            particleSystem = new BABYLON.GPUParticleSystem("particles", {
                capacity: 1000000
            }, scene);
            particleSystem.activeParticleCount = 200000;
        } else {
            particleSystem = new BABYLON.ParticleSystem("particles", 50000, scene);
        }

        particleSystem.emitRate = 10000;
        particleSystem.particleEmitterType = new BABYLON.SphereParticleEmitter(1);
        particleSystem.particleTexture = new BABYLON.Texture("/textures/flare.png", scene);
        particleSystem.maxLifeTime = 10;
        particleSystem.minSize = 0.01;
        particleSystem.maxSize = 0.1;
        particleSystem.emitter = fountain;

        particleSystem.start();
    }

    createNewSystem();


    var alpha = 0;
    var moveEmitter = false;
    var rotateEmitter = true;

    return scene;
}

var engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: false,
    stencil: true
});
var scene = null;
var scene_sel = 'cube';

scenes = ['cube', 'particle', 'drstrange'];
scene_sel = scenes[Math.floor(Math.random() * scenes.length)];

if (scene_sel == 'drstrange') {
    scene = createDrStrange();
} else if (scene_sel == 'cube') {
    scene = createSceneCube();
} else if (scene_sel == 'particle') {
    scene = createSceneParticle();
}

engine.runRenderLoop(function() {
    if (scene) {
        scene.render();
    }
});


// Resize
window.addEventListener("resize", function() {
    engine.resize();
});
