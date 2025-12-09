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
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                gap: 20px;
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
            border: 2px solid rgba(255, 255, 255, 0.8);
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
            color: #fff;
            font-size: 30px;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        `
        leftBtn.addEventListener('mouseenter', () => {
            leftBtn.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.6))'
            leftBtn.style.transform = 'scale(1.1)'
            leftBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
        })
        leftBtn.addEventListener('mouseleave', () => {
            leftBtn.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))'
            leftBtn.style.transform = 'scale(1)'
            leftBtn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
        })
        leftBtn.addEventListener('click', () => this.navigatePrevious())

        // Crear slider de zoom
        const sliderContainer = document.createElement('div')
        sliderContainer.style.cssText = `
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        `

        const sliderLabel = document.createElement('span')
        sliderLabel.textContent = 'Zoom'
        sliderLabel.style.cssText = `
            color: #fff;
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        `

        const slider = document.createElement('input')
        slider.type = 'range'
        slider.min = '0'
        slider.max = '2000'
        slider.value = '0'
        slider.style.cssText = `
            width: 200px;
            height: 8px;
            -webkit-appearance: none;
            appearance: none;
            background: linear-gradient(90deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
            border-radius: 10px;
            outline: none;
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        `

        // Estilo para el thumb del slider
        const style = document.createElement('style')
        style.textContent = `
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                cursor: pointer;
                box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
                transition: all 0.2s ease;
            }
            input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 0 15px rgba(102, 126, 234, 0.8);
            }
            input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                cursor: pointer;
                border: none;
                box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
                transition: all 0.2s ease;
            }
            input[type="range"]::-moz-range-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 0 15px rgba(102, 126, 234, 0.8);
            }
        `
        document.head.appendChild(style)

        slider.addEventListener('input', (e) => {
            this.scrollY = parseFloat(e.target.value)
            this.models[this.currentIndex].updateScroll(this.scrollY)
        })

        sliderContainer.appendChild(sliderLabel)
        sliderContainer.appendChild(slider)

        // Botón derecho
        const rightBtn = document.createElement('button')
        rightBtn.innerHTML = '&#8594;'
        rightBtn.style.cssText = leftBtn.style.cssText
        rightBtn.addEventListener('mouseenter', () => {
            rightBtn.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.6))'
            rightBtn.style.transform = 'scale(1.1)'
            rightBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
        })
        rightBtn.addEventListener('mouseleave', () => {
            rightBtn.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))'
            rightBtn.style.transform = 'scale(1)'
            rightBtn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
        })
        rightBtn.addEventListener('click', () => this.navigateNext())

        navContainer.appendChild(leftBtn)
        navContainer.appendChild(sliderContainer)
        navContainer.appendChild(rightBtn)

        this.leftBtn = leftBtn
        this.rightBtn = rightBtn
        this.zoomSlider = slider
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
        
        // Resetear slider
        if (this.zoomSlider) {
            this.zoomSlider.value = '0'
        }
    }

    setupScroll() {
        this.scrollY = 0

        window.addEventListener('wheel', (event) => {
            event.preventDefault()
            this.scrollY += event.deltaY * 0.5
            this.scrollY = Math.max(0, Math.min(this.scrollY, 2000))
            
            // Actualizar el scroll del modelo actual
            this.models[this.currentIndex].updateScroll(this.scrollY)
            
            // Sincronizar slider
            if (this.zoomSlider) {
                this.zoomSlider.value = this.scrollY.toString()
            }
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
