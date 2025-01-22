import {IEEEUserResponse} from './ieee-user/ieee-user.response';
import {CommissionType, Gender, Role} from './ieee-user/ieee-team.enums';

export interface TeamMember {
    name: string;
    photo: string;
    linkedin?: string;
    email: string;
    commissionid: string;
    positionid: string;
}

export class IEEEMember implements TeamMember {
    name: string;
    photo: string;
    linkedin?: string;
    email: string;
    commissionid: string;
    positionid: string;

    constructor(name: string, mail: string, commissionid: string, positionid: string, photo?: string, linkedin?: string) {
        this.name = name;
        this.email = mail;
        this.commissionid = commissionid;
        this.positionid = positionid;
        this.photo = photo;
        this.linkedin = linkedin;
    }

    static fromIeeeUserResponse({name, photo, linkedin, mail, commissionid, positionid}: IEEEUserResponse): IEEEMember {
        return new IEEEMember(
            name,
            photo,
            linkedin,
            mail,
            commissionid,
            positionid
        );
    }

    // Necesario para el pipe de traducción. Los enums en TypeScript no pueden contener más info
    static mapRoleToI18n(commission: CommissionType, gender: Gender): string {
        return `HOME.CARGO.${commission}.${gender}`;
    }
}
