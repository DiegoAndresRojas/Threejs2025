import EventEmitter from './EventEmitter'


export default class Time extends EventEmitter {

    constructor() {
        super()

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16 // eye human and devices works at 16fps
        
        // Puedes colocar aca el windows animation frame
        this.tick()
        // window.requestAnimationFrame(() => {
        //     this.tick()
        // })
    }

    tick() {

        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start
        this.trigger('tick')
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
} 