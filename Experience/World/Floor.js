import Experience from '../Experience'
import * as THREE from 'three'
export default class Floor {
    constructor() {
        this.experience = Experience.getInstance()
        this.scene = this.experience.scene
        this.resources = this.experience.resources


        this.setGeometry()
        this.setTexture()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry(){
        this.geometry = new THREE.CircleGeometry(5,64)
    }
    
    setTexture(){
        // Ya no usamos texturas, solo color
    }
    
    setMaterial(){
        this.material = new THREE.MeshStandardMaterial({
            color: '#8B6F47', // Color madera más claro
            roughness: 0.7,
            metalness: 0.1
        })
    }
    
    setMesh(){
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.mesh.position.y = 0 // El piso siempre está en Y = 0
        this.scene.add(this.mesh)
    }
    
}