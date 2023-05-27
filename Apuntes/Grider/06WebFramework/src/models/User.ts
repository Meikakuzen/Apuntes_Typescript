interface UserProps {
    name?: string
    age?: number
}


//tipo que creo para tener un código más legible
type Callback = ()=>{}

export class User{
    constructor(private data: UserProps){}

    get(propName : string): string | number{
        return this.data[propName]
    }

    set(update: UserProps): void{
        Object.assign(this.data, update) //toma los valores de update y los copia en this.data
    }

    on(eventName: string, callback: Callback){

    }

}