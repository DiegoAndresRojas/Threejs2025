export default class LoadingScreen {
    constructor() {
        this.element = document.getElementById('loading-screen')
        this.isVisible = true
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
