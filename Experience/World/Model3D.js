import Experience from "../Experience";
import Time from "../Utils/Time";
import * as THREE from 'three'

export default class Model3D 
{
    constructor(resourceName, 
        
            scale = 1, 
            decompositionConfig = null, 
            maxScroll = 6){
        
        this.experience = Experience.getInstance()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = new Time()
        this.resourceName = resourceName
        this.scale = scale
        this.resource = this.resources.items[resourceName]
        this.debug = this.experience.debug

        // Configuración de descomposición por defecto (aleatoria)
        this.decompositionConfig = decompositionConfig || {
            inX: true,
            inY: true,
            inZ: true,
            dx: 0,  // 0 = ambas direcciones
            dy: 1,  // 0 = ambas direcciones
            dz: 0   // 0 = ambas direcciones
        }

        this.maxScroll = maxScroll

        if(this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(resourceName)
        }

        this.setModel()
        this.setBoundingBox()
        this.setScroll()
    }

    getDepth(object) {
        let depth = 0
        let current = object
        
        // Contar cuántos padres tiene hasta llegar al modelo raíz
        while (current.parent && current.parent !== this.scene) {
            depth++
            current = current.parent
        }
        
        return depth
    }

    calculateDirection() {
        const config = this.decompositionConfig
        const direction = new THREE.Vector3(0, 0, 0)
        
        // Calcular componente X
        if (config.inX) {
            if (config.dx === -1) {
                // Solo dirección negativa
                direction.x = -Math.random()
            } else if (config.dx === 1) {
                // Solo dirección positiva
                direction.x = Math.random()
            } else {
                // Ambas direcciones (dx === 0)
                direction.x = (Math.random() - 0.5) * 2
            }
        }
        
        // Calcular componente Y
        if (config.inY) {
            if (config.dy === -1) {
                // Solo dirección negativa
                direction.y = -Math.random()
            } else if (config.dy === 1) {
                // Solo dirección positiva
                direction.y = Math.random()
            } else {
                // Ambas direcciones (dy === 0)
                direction.y = (Math.random() - 0.5) * 2
            }
        }
        
        // Calcular componente Z
        if (config.inZ) {
            if (config.dz === -1) {
                // Solo dirección negativa
                direction.z = -Math.random()
            } else if (config.dz === 1) {
                // Solo dirección positiva
                direction.z = Math.random()
            } else {
                // Ambas direcciones (dz === 0)
                direction.z = (Math.random() - 0.5) * 2
            }
        }
        
        // Si la dirección es cero (todos los ejes deshabilitados), usar dirección por defecto
        if (direction.lengthSq() === 0) {
            direction.set(
                (Math.random() - 0.5) * 2,
                Math.random() * 0.5 + 0.3,
                (Math.random() - 0.5) * 2
            )
        }
        
        return direction.normalize()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(this.scale, this.scale, this.scale)
        this.scene.add(this.model)
        
        // Guardar información de cada pieza
        this.pieces = []
        let pieceCount = 0
        
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
                pieceCount++
                
                // Calcular nivel de profundidad
                const depth = this.getDepth(child)
                
                // Calcular dirección según la configuración
                const direction = this.calculateDirection()
                
                this.pieces.push({
                    mesh: child,
                    initialPosition: child.position.clone(),
                    direction: direction,
                    depth: depth
                })
            }
        })

        // Mostrar el número de piezas
        console.log(`El modelo ${this.resourceName} tiene ${pieceCount} piezas`)

        if(this.debug.active) {
            this.debugFolder.add(this.model.position, 'x').min(-10).max(10).step(0.01).name('posX')
            this.debugFolder.add(this.model.position, 'y').min(-10).max(10).step(0.01).name('posY')
            this.debugFolder.add(this.model.position, 'z').min(-10).max(10).step(0.01).name('posZ')
        }
    }

    setBoundingBox() {
        // Forzar actualización de la matriz del modelo
        this.model.updateMatrixWorld(true)
        
        // Calcular el bounding box del modelo
        const box = new THREE.Box3().setFromObject(this.model)
        
        // Obtener dimensiones y centro de la caja
        const size = new THREE.Vector3()
        const center = new THREE.Vector3()
        box.getSize(size)
        box.getCenter(center)
        
        // Calcular offsets necesarios para centrar el objeto en el origen (X, Z) 
        // y colocarlo sobre el piso (Y=0)
        const offsetX = -center.x
        const offsetY = -box.min.y
        const offsetZ = -center.z
        
        this.model.position.set(offsetX, offsetY, offsetZ)
        
        // Actualizar nuevamente después del reposicionamiento
        this.model.updateMatrixWorld(true)
        
        console.log(`${this.resourceName} - Dimensiones:`, size)
        console.log(`${this.resourceName} - Centro original:`, center)
        console.log(`${this.resourceName} - Offsets aplicados: X=${offsetX.toFixed(3)}, Y=${offsetY.toFixed(3)}, Z=${offsetZ.toFixed(3)}`)
    }

    setScroll() {
        // El scroll será manejado por el ModelCarousel
        this.scrollY = 0
        
    }

    updateScroll(scrollY) {
        this.scrollY = scrollY
        console.log(scrollY)
    }

    show() {
        this.model.visible = true
    }

    hide() {
        this.model.visible = false
    }

    setPosition(x, y, z) {
        // Recalcular el bounding box para obtener el offset correcto
        const box = new THREE.Box3().setFromObject(this.model)
        const offsetY = -box.min.y
        this.model.position.set(x, offsetY + y, z)
    }

    update() {
        if (this.pieces.length > 0) {
            // Factor de separación basado en el scroll (0 a 1)
            const separationFactor = Math.min(this.scrollY / 2000, 1)
            
            this.pieces.forEach(piece => {
                // El desplazamiento aumenta con la profundidad
                // depth 0 = sin desplazamiento, depth > 0 = más desplazamiento
                const depthMultiplier = piece.depth * 0.5 + 1 // Multiplicador basado en profundidad
                
                // Interpolar entre la posición inicial y la posición separada
                const targetPosition = piece.initialPosition.clone().add(
                    piece.direction.clone().multiplyScalar(this.maxScroll * separationFactor * depthMultiplier)
                )
                
                // Suavizar el movimiento con lerp
                piece.mesh.position.lerp(targetPosition, 0.1)
            })
        }
    }

    destroy() {
        if(this.model) {
            this.scene.remove(this.model)
        }
    }
}
