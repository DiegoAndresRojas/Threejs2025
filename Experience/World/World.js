import Experience from "../Experience"
import * as THREE from 'three';
import Environment from "./Environment";
import Floor from "./Floor";
import ModelGallery from "./ModelGallery";

export default class World {

    constructor() {
        this.experience = Experience.getInstance()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.loadingScreen = this.experience.loadingScreen
        
        // Variables para la animación de cámara
        this.cameraAnimation = {
            isAnimating: false,
            startY: 20,
            targetY: 4,
            currentY: 20,
            duration: 2500, // ms
            elapsed: 0
        }
                
        this.resources.on('everythingIsLoaded', () => {    
            this.floor = new Floor()
            this.modelGallery = new ModelGallery()
            this.environment = new Environment()
            
            // Iniciar animación de cámara y ocultar pantalla de carga
            this.startIntroAnimation()
        })
    }

    startIntroAnimation() {
        // Configurar posición inicial de la cámara
        this.camera.instance.position.set(6, this.cameraAnimation.startY, 8)
        
        // Ocultar la pantalla de carga
        this.loadingScreen.hide()
        
        // Iniciar animación
        this.cameraAnimation.isAnimating = true
        this.cameraAnimation.elapsed = 0
    }

    // Función de easing para suavizar la animación (easeInOutQuad)
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    }

    update() {
        if(this.modelGallery)
            this.modelGallery.update()
        
        // Actualizar animación de cámara
        if(this.cameraAnimation.isAnimating) {
            this.cameraAnimation.elapsed += this.experience.time.delta
            
            const progress = Math.min(this.cameraAnimation.elapsed / this.cameraAnimation.duration, 1)
            const easedProgress = this.easeInOutQuad(progress)
            
            // Interpolar la posición Y
            this.camera.instance.position.y = this.cameraAnimation.startY + 
                (this.cameraAnimation.targetY - this.cameraAnimation.startY) * easedProgress
            
            // Terminar animación cuando se complete
            if(progress >= 1) {
                this.cameraAnimation.isAnimating = false
                this.camera.instance.position.y = this.cameraAnimation.targetY
            }
        }
    }
}