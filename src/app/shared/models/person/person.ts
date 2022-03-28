export class Person {
    id: number;
    name: string;
    photo: string;
    linkedin: string;
    mail: string;
    cargo: string;
    id2: number;

    constructor(Name: string, Photo: string, Linkedin: string, Mail: string, Cargo: string) {
        this.name = Name;
        this.photo = Photo;
        this.linkedin = Linkedin;
        this.mail = Mail;
        this.cargo = Cargo;
    }

}
