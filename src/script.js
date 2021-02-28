import './style.css'
import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
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
const matcapTexture1 = textureLoader.load('/textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png')
const matcapTexture3 = textureLoader.load('/textures/matcaps/3.png')
const matcapTexture4 = textureLoader.load('/textures/matcaps/4.png')
const matcapTexture5 = textureLoader.load('/textures/matcaps/5.png')
const matcapTexture6 = textureLoader.load('/textures/matcaps/6.png')
const matcapTexture7 = textureLoader.load('/textures/matcaps/7.png')


//Fonts

let text;
let donutGeometry
const donuts = [];
const rotationRateX = []
const rotationRateY = [];
let matcapMaterial
let matcapAdded = false
const matcaps = {
    selected:  'matcapTexture5',
}
let donutsAmount = {
    number :  1000
}
let allObjRemoved = false
let controls

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

        matcapMaterial = new THREE.MeshMatcapMaterial()
        matcapMaterial.matcap = eval(matcaps.selected)
        text = new THREE.Mesh(textGeometry, matcapMaterial)
        scene.add(text)

        donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

        

        for (let i = 0; i <= donutsAmount.number; i++) {

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

let mobileControlsEnabled = false
//mobile ==> orbit controls
if (window.innerWidth<900) {
    controls = new TrackballControls( camera, canvas );
    controls.enableDamping = true
    controls.dynamicDampingFactor = 0.09;
    controls.enableZoom = false;
    mobileControlsEnabled = true
    camera.position.z = 5
}

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

    if (mobileControlsEnabled === true && window.innerWidth<900) {
    //update orbitControls
    controls.update();
    }else{
        camera.position.x = Math.sin(cursor.x -elapsedTime) * 3
        camera.position.y = Math.sin(cursor.y +elapsedTime) * 2
        camera.position.z = Math.sin((cursor.y + cursor.x) * Math.PI +elapsedTime/10) *10    
    }

    if (text!==undefined) {
        camera.lookAt(text.position)
        text.rotation.y = Math.sin(elapsedTime/2)
        text.rotation.x = Math.sin(elapsedTime /6)
    }
    if(matcapMaterial!==undefined && !matcapAdded){
        gui.add(matcaps, "selected", [    
            'matcapTexture1',
            'matcapTexture2',
            'matcapTexture3',
            'matcapTexture4',
            'matcapTexture5',
            'matcapTexture6',
            'matcapTexture7'
        ]).name("texture").onChange(()=>matcapMaterial.matcap = eval(matcaps.selected))
        
        matcapAdded = true
        gui.add(donutsAmount, "number",0,10000).name("number of donuts").onChange(
            ()=> {

                for (let i = 0; i <=donuts.length; i++) {
                            allObjRemoved = false
                            scene.remove(donuts[i])
                            if (i === donuts.length) {
                                allObjRemoved = true
                            }
                        }
    
                        if(allObjRemoved){
                            allObjRemoved = false
                            for (let k = 0; k <= donutsAmount.number; k++) {
                        
                                donuts[k] = new THREE.Mesh(donutGeometry, matcapMaterial)
                                donuts[k].position.x = (Math.random() -0.5) * 30
                                donuts[k].position.y = (Math.random() -0.5) * 30
                                donuts[k].position.z = (Math.random() -0.5) * 30
                    
                                donuts[k].rotation.x = Math.random() * Math.PI
                                donuts[k].rotation.y = Math.random() * Math.PI
                    
                    
                                rotationRateX[k] = Math.random()
                                rotationRateY[k] = Math.random()
                    
                                const scale = Math.random()
                                donuts[k].scale.set(scale, scale, scale)
                    
                                scene.add(donuts[k])
                            }
                        }
            }
        )
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()