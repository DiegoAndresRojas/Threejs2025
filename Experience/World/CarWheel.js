import Model3D from './Model3D'

export default class CarWheel extends Model3D
{
    constructor() {
        super('carWheelModel', 1, {
            inX: true,
            inY: true,
            inZ: true,
            dx: 0,
            dy: 1,
            dz: 0 
        }, 1.4)
    }
}
