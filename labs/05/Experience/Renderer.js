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
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}