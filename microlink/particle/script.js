
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const material = new THREE.MeshToonMaterial({ color: '#ffeded' })

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 1, 1, 1),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 1, 1),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 1, 1, 1),
    material
)

scene.add(mesh1, mesh2, mesh3)
mesh1.position.y = 2
mesh1.scale.set(0.5, 0.5, 0.5)

mesh2.visible = false

mesh3.position.y = - 2
mesh3.scale.set(0.5, 0.5, 0.5)
const objectsDistance = 4
mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2
mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

const sectionMeshes = [mesh1, mesh2, mesh3]

const particlesCount = 300
const positions = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = Math.random()
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10

}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffeded',
    sizeAttenuation: true,
    size: 0.03
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const cursor = {}
cursor.x = 0
cursor.y = 0
scene.add(particles)

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width * 2, sizes.height * 2)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true

})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearAlpha(0)

const clock = new THREE.Clock()
let previousTime = 0

let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = scrollY / sizes.height


})

const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    console.log(deltaTime)

    camera.position.y = - scrollY / sizes.height * objectsDistance

    renderer.render(scene, camera)
    camera.position.y = - scrollY / sizes.height * objectsDistance
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    for (const mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.12

    }
    window.requestAnimationFrame(tick)
}

tick()




