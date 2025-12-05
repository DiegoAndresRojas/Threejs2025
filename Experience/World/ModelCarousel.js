import Experience from "../Experience";
import * as THREE from 'three'
import OfficePC from "./OfficePC";
import SillaSkium from "./SillaSkium";
import CarWheel from "./CarWheel";

export default class ModelCarousel 
{
    constructor() {
        this.experience = Experience.getInstance()
        this.scene = this.experience.scene
        
        this.currentIndex = 0
        this.isFading = false
        this.fadeProgress = 0
        
        this.setupModels()
        this.setupNavigation()
        this.setupScroll()
    }

    setupModels() {
        // Crear instancias de los modelos
        this.models = [
            new OfficePC(),
            new SillaSkium(),
            new CarWheel()
        ]
        
        // Todos los modelos en el mismo lugar (centro)
        this.models.forEach((model, index) => {
            model.setPosition(0, 0, 0)
            
            // Ocultar todos excepto el primero
            if (index !== this.currentIndex) {
                model.hide()
                this.setModelOpacity(model, 0)
            } else {
                model.show()
                this.setModelOpacity(model, 1)
            }
        })
    }

    setModelOpacity(model, opacity) {
        model.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (child.material) {
                    // Hacer una copia del material si es compartido
                    if (!child.material.userData.isCloned) {
                        child.material = child.material.clone()
                        child.material.userData.isCloned = true
                    }
                    child.material.transparent = true
                    child.material.opacity = opacity
                }
            }
        })
    }

    setupNavigation() {
        this.createNavigationButtons()
    }

    createNavigationButtons() {
        // Crear contenedor de botones si no existe
        let navContainer = document.getElementById('model-navigation')
        if (!navContainer) {
            navContainer = document.createElement('div')
            navContainer.id = 'model-navigation'
            navContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 0;
                right: 0;
                transform: translateY(-50%);
                display: flex;
                justify-content: space-between;
                padding: 0 30px;
                pointer-events: none;
                z-index: 1000;
            `
            document.body.appendChild(navContainer)
        }

        // Botón izquierdo
        const leftBtn = document.createElement('button')
        leftBtn.innerHTML = '&#8592;'
        leftBtn.style.cssText = `
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid #ff8c42;
            background: rgba(255, 140, 66, 0.2);
            color: #ff8c42;
            font-size: 30px;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `
        leftBtn.addEventListener('mouseenter', () => {
            leftBtn.style.background = 'rgba(255, 140, 66, 0.5)'
            leftBtn.style.transform = 'scale(1.1)'
        })
        leftBtn.addEventListener('mouseleave', () => {
            leftBtn.style.background = 'rgba(255, 140, 66, 0.2)'
            leftBtn.style.transform = 'scale(1)'
        })
        leftBtn.addEventListener('click', () => this.navigatePrevious())

        // Botón derecho
        const rightBtn = document.createElement('button')
        rightBtn.innerHTML = '&#8594;'
        rightBtn.style.cssText = leftBtn.style.cssText
        rightBtn.addEventListener('mouseenter', () => {
            rightBtn.style.background = 'rgba(255, 140, 66, 0.5)'
            rightBtn.style.transform = 'scale(1.1)'
        })
        rightBtn.addEventListener('mouseleave', () => {
            rightBtn.style.background = 'rgba(255, 140, 66, 0.2)'
            rightBtn.style.transform = 'scale(1)'
        })
        rightBtn.addEventListener('click', () => this.navigateNext())

        navContainer.appendChild(leftBtn)
        navContainer.appendChild(rightBtn)

        this.leftBtn = leftBtn
        this.rightBtn = rightBtn
    }

    navigateNext() {
        if (this.isFading) return
        
        this.oldIndex = this.currentIndex
        this.currentIndex = (this.currentIndex + 1) % this.models.length
        this.startFade()
    }

    navigatePrevious() {
        if (this.isFading) return
        
        this.oldIndex = this.currentIndex
        this.currentIndex = (this.currentIndex - 1 + this.models.length) % this.models.length
        this.startFade()
    }

    startFade() {
        this.isFading = true
        this.fadeProgress = 0
        
        // Resetear scroll cuando cambiamos de modelo
        this.scrollY = 0
        this.models[this.currentIndex].updateScroll(0)
    }

    setupScroll() {
        this.scrollY = 0

        window.addEventListener('wheel', (event) => {
            event.preventDefault()
            this.scrollY += event.deltaY * 0.5
            this.scrollY = Math.max(0, Math.min(this.scrollY, 2000))
            
            // Actualizar el scroll del modelo actual
            this.models[this.currentIndex].updateScroll(this.scrollY)
        }, { passive: false })
    }

    update() {
        // Animar fade
        if (this.isFading) {
            this.fadeProgress += 0.05
            
            if (this.fadeProgress >= 1) {
                this.fadeProgress = 1
                this.isFading = false
                
                // Asegurar que el modelo viejo está completamente oculto
                this.setModelOpacity(this.models[this.oldIndex], 0)
                this.models[this.oldIndex].hide()
            }
            
            // Fade out del modelo anterior
            const fadeOutProgress = Math.min(this.fadeProgress * 2, 1)
            this.setModelOpacity(this.models[this.oldIndex], 1 - fadeOutProgress)
            
            // Fade in del modelo nuevo (empieza cuando fade out está a la mitad)
            const fadeInProgress = Math.max((this.fadeProgress - 0.5) * 2, 0)
            if (fadeInProgress > 0) {
                this.models[this.currentIndex].show()
                this.setModelOpacity(this.models[this.currentIndex], fadeInProgress)
            }
        }

        // Actualizar solo el modelo visible
        this.models[this.currentIndex].update()
    }

    destroy() {
        // Limpiar botones
        const navContainer = document.getElementById('model-navigation')
        if (navContainer) {
            navContainer.remove()
        }

        // Limpiar modelos
        this.models.forEach(model => model.destroy())
    }
}
