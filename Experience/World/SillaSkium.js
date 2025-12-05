import Model3D from './Model3D'

export default class SillaSkium extends Model3D
{
    constructor() {
        super('sillaSkiumModel', 4, {
            inX: true,
            inY: false,
            inZ: true,
            dx: 0,
            dy: 0,
            dz: 0 
        }, 0.2)
    }
}
