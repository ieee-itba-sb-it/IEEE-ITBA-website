export interface TeamMember {
    name: string;
    photo: string;
    linkedin: string;
    mail: string;
    role: string;
}

export class IEEEMember implements TeamMember {
    name: string;
    photo: string;
    linkedin: string;
    mail: string;
    role: string;

    constructor(name: string, photo: string, linkedin: string, mail: string, role: string) {
        this.name = name;
        this.photo = photo;
        this.linkedin = linkedin;
        this.mail = mail;
        this.role = role;
    }
}
