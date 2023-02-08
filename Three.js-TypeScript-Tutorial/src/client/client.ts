import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
const colorWhite = new THREE.Color(0xffffff)
const axesHelper = new THREE.AxesHelper(5)
axesHelper.setColors(colorWhite,colorWhite,colorWhite)
axesHelper.translateZ(-5)
scene.add(axesHelper)

const light = new THREE.PointLight()
light.position.set(0.8, 1.4, 1.0)
scene.add(light)

const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

let mixer: THREE.AnimationMixer
let modelReady = false
const animationActions: THREE.AnimationAction[] = []
let activeAction: THREE.AnimationAction
let lastAction: THREE.AnimationAction
const gltfLoader = new GLTFLoader()

gltfLoader.load(
    './models/minime.glb',
    (gltf) => {
        gltf.scene.scale.set(1, 1, 1)
        
        mixer = new THREE.AnimationMixer(gltf.scene)

        var action = mixer.clipAction(gltf.animations[0])
        action.play()
        const obj = gltf.scene

        const animationAction = mixer.clipAction((gltf as any).animations[0])
        animationActions.push(animationAction)
        animationsFolder.add(animations, 'default')
        activeAction = animationActions[0]


        scene.add(obj,light);

        gltf.animations;
        gltf.scene;
        gltf.scenes;
        gltf.cameras;
        gltf.asset;

        //add an animation from another file
        gltfLoader.load(
            'models/minime@swing.glb',
            (gltf) => {
                console.log('loaded swing')
                const animationAction = mixer.clipAction(
                    (gltf as any).animations[1]
                )
                animationActions.push(animationAction)
                animationsFolder.add(animations, 'swing')

                //add an animation from another file
                gltfLoader.load(
                    'models/minime@relax.glb',
                    (gltf) => {
                        console.log('loaded relax')
                        const animationAction = mixer.clipAction(
                            (gltf as any).animations[2]
                        )
                        animationActions.push(animationAction)
                        animationsFolder.add(animations, 'relax')

                        //add an animation from another file
                        gltfLoader.load(
                            'models/minime@sleep.glb',
                            (gltf) => {
                                console.log('loaded sleep');
                                (gltf as any).animations[0].tracks.shift() //delete the specific track that moves the object forward while running
                                const animationAction = mixer.clipAction(
                                    (gltf as any).animations[3]
                                )
                                animationActions.push(animationAction)
                                animationsFolder.add(animations, 'sleep')

                                modelReady = true
                            },
                            (xhr) => {
                                console.log(
                                    (xhr.loaded / xhr.total) * 100 + '% loaded'
                                )
                            },
                            (error) => {
                                console.log(error)
                            }
                        )
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                    },
                    (error) => {
                        console.log(error)
                    }
                )
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 7
camera.position.x = 2.5
camera.position.y = 3
camera.translateZ(2)
const canvas = document.getElementById("c1") as HTMLCanvasElement

const renderer = new THREE.WebGLRenderer({canvas:canvas})
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true
renderer.outputEncoding = THREE.sRGBEncoding



renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)
renderer.setClearColor(0xffffff,1);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true




window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

// const stats = Stats()
// document.body.appendChild(stats.dom)


const animations = {
    default: function () {
        setAction(animationActions[0])
    },
    swing: function () {
        setAction(animationActions[1])
    },
    relax: function () {
        setAction(animationActions[2])
    },
    sleep: function () {
        setAction(animationActions[3])
    }
}

const setAction = (toAction: THREE.AnimationAction) => {
    if (toAction != activeAction) {
        lastAction = activeAction
        activeAction = toAction
        // lastAction.stop()
        lastAction.fadeOut(1)
        activeAction.reset()
        activeAction.fadeIn(1)
        activeAction.play()
    }
}

const gui = new GUI()
const animationsFolder = gui.addFolder('Animations')
animationsFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()

const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    if (modelReady) mixer.update(clock.getDelta())

    render()

    // stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()




