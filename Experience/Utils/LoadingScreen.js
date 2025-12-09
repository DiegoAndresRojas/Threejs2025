export default class LoadingScreen {
    constructor() {
        this.element = document.getElementById('loading-screen')
        this.counterElement = document.getElementById('loading-counter')
        this.progressFillElement = document.getElementById('progress-fill')
        this.isVisible = true
    }

    updateProgress(loaded, total) {
        if (this.counterElement) {
            this.counterElement.textContent = `${loaded} / ${total}`
        }
        if (this.progressFillElement && total > 0) {
            const percentage = (loaded / total) * 100
            this.progressFillElement.style.width = `${percentage}%`
        }
    }

    hide() {
        if (!this.isVisible) return
        
        this.element.classList.add('fade-out')
        this.isVisible = false
        
        // Remover el elemento del DOM después de la transición
        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element)
            }
        }, 800)
    }

    show() {
        if (this.isVisible) return
        
        this.element.classList.remove('fade-out')
        this.isVisible = true
    }
}
