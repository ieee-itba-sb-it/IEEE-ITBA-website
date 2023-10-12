import {IEEEUserResponse} from './ieee-user/ieee-user.response';
import {CommissionType, Gender, Role} from './ieee-user/ieee-team.enums';

export interface TeamMember {
    name: string;
    photo: string;
    linkedin: string;
    mail: string;
    role?: string;
}

export class IEEEMember implements TeamMember {
    name: string;
    photo: string;
    linkedin: string;
    mail: string;
    role?: string;

    constructor(name: string, photo: string, linkedin: string, mail: string, role: string) {
        this.name = name;
        this.photo = photo;
        this.linkedin = linkedin;
        this.mail = mail;
        this.role = role;
    }

    static fromIeeeUserResponse({name, photo, linkedin, mail, role, gender, commission}: IEEEUserResponse): IEEEMember {
        return new IEEEMember(
            name,
            photo,
            linkedin,
            mail,
            this.mapRoleToI18n(commission, role, gender)
        );
    }

    // Necesario para el pipe de traducción. Los enums en TypeScript no pueden contener más info
    static mapRoleToI18n(commission: CommissionType, role: Role, gender: Gender): string {
        return `HOME.CARGO.${commission}.${role}.${gender}`;
    }
}
