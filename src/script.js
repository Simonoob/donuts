import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/matcap.png')


//Fonts

let text;

const donuts = [];
const rotationRateX = []
const rotationRateY = []

const fontLoader = new THREE.FontLoader();
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new THREE.TextGeometry(
            'Donuts',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 2
            }
        )

        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02)/2,
        //     - (textGeometry.boundingBox.max.y - 0.02)/2,
        //     - (textGeometry.boundingBox.max.z - 0.03)/2,
        // )

        textGeometry.center()

        const matcapMaterial = new THREE.MeshNormalMaterial()
        text = new THREE.Mesh(textGeometry, matcapMaterial)
        scene.add(text)

        const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

        

        for (let i = 0; i <= 1000; i++) {

            donuts[i] = new THREE.Mesh(donutGeometry, matcapMaterial)
            donuts[i].position.x = (Math.random() -0.5) * 30
            donuts[i].position.y = (Math.random() -0.5) * 30
            donuts[i].position.z = (Math.random() -0.5) * 30

            donuts[i].rotation.x = Math.random() * Math.PI
            donuts[i].rotation.y = Math.random() * Math.PI

            rotationRateX[i] = Math.random()
            rotationRateY[i] = Math.random()

            const scale = Math.random()
            donuts[i].scale.set(scale, scale, scale)

            scene.add(donuts[i])
        }
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 3

// Cursor
const cursor = {
    x: 0,
    y: 0
}

//
// Camera Controls
//

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})


scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    for (let i = 0; i < donuts.length; i++) {
        donuts[i].rotation.x = rotationRateX[i] * elapsedTime
        donuts[i].rotation.y = rotationRateY[i] * elapsedTime
    }

    

    // Update camera

    camera.position.x = cursor.x * 15
    camera.position.y = cursor.y * 15
    camera.position.z = Math.sin((cursor.y + cursor.x) * Math.PI * 2)
    if (text!==undefined) {
        camera.lookAt(text.position)
        text.rotation.y = elapsedTime
        text.rotation.x = Math.cos(-elapsedTime)
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()