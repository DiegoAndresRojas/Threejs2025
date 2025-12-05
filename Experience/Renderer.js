import Experience from "./Experience"
import * as THREE from 'three'

export default class Renderer {

    constructor() {
        this.experience = Experience.getInstance()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.canvas = this.experience.canvas        

        this.setInstance()
    }

    setInstance() {

        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        
        // Crear gradiente naranja
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const context = canvas.getContext('2d')
        const gradient = context.createLinearGradient(0, 0, 0, 512)
        gradient.addColorStop(0, '#ff9a56')  // Naranja claro arriba
        gradient.addColorStop(1, '#ff6b35')  // Naranja oscuro abajo
        context.fillStyle = gradient
        context.fillRect(0, 0, 512, 512)
        
        const texture = new THREE.CanvasTexture(canvas)
        this.scene.background = texture
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}