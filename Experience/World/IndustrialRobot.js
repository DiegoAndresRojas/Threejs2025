import Model3D from './Model3D'

export default class IndustrialRobot extends Model3D
{
    constructor() {
        super('industrialRobotModel', 6, {
            inX: true,
            inY: true,
            inZ: true,
            dx: 0,
            dy: 1,
            dz: 0 
        }, 1.4)
    }
}
