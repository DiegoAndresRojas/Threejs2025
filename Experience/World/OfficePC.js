import Model3D from './Model3D'

export default class OfficePC extends Model3D
{
    constructor() {
        super('officePCModel', 6, {
            inX: true,
            inY: false,
            inZ: true,
            dx: 0,
            dy: 0,
            dz: 0 
        }, 5)
    }
}
