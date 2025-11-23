import * as THREE from 'three';
import Sizes from './Utils/Size';
import Time from './Utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World';
import Resources from './Utils/Resources';
import sources from './sources.js'
import Debug from './Utils/Debug.js';


export default class Experience {

    static instance

    static getInstance() {
        return Experience.instance
    }

    constructor() {
   
        if(Experience.instance) {
            return this.instance
        }

        Experience.instance = this
        window.experience = this

        this.debug = new Debug()
        this.sizes = new Sizes()
        this.initialization()

        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.time = new Time()
        this.camera = new Camera()
        this.renderer = new Renderer()

        //Events
        this.sizes.on('resize', () => this.resize() )
        this.time.on('tick', () => {
            this.update()
        })

        //test
        this.world = new World() 
    }

    initialization() {
        const renderer = new THREE.WebGLRenderer({
                    antialias: true
                })
        this.canvas = renderer.domElement
        window.document.body.appendChild(this.canvas)
        window.document.body.style.margin = 0;
    }
    
    resize() {
        this.camera.resize()
        this.renderer.resize()
    }
 
    update() {
        // console.log('updated', this.time.delta)
        this.world.update()
        this.camera.update()
        this.renderer.update()
        
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')
    }
}