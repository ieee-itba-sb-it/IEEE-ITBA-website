import {IEEEUserResponse} from './ieee-user/ieee-user.response';
import {Role} from './ieee-user/ieee-team.enums';

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

    static fromIeeeUserResponse(ieeeUserResponse: IEEEUserResponse): IEEEMember {
        return new IEEEMember(
            ieeeUserResponse.name,
            ieeeUserResponse.photo,
            ieeeUserResponse.linkedin,
            ieeeUserResponse.mail,
            this.mapRoleToI18n(ieeeUserResponse.role)
        );
    }

    // Necesario para el pipe de traducción. Los enums en TypeScript no pueden contener más info
    static mapRoleToI18n(role: Role): string {
        switch (role) {
        case Role.CD_OFFICER:
            return 'HOME.CARGO.CD.OFFICER';
        case Role.MEDIACOM_DIRECTOR:
            return 'HOME.CARGO.MEDIACOM.DIRECTOR';
        case Role.MEDIACOM_CCA:
            return 'HOME.CARGO.MEDIACOM.CCA';
        case Role.MEDIACOM_CC:
            return 'HOME.CARGO.MEDIACOM.CC';
        case Role.MEDIACOM_ILLUSTRATOR:
            return 'HOME.CARGO.MEDIACOM.ILLUSTRATOR';
        case Role.MEDIACOM_WRITER_FEM:
            return 'HOME.CARGO.MEDIACOM.WRITER-FEM';
        case Role.MEDIACOM_WRITER_MASC:
            return 'HOME.CARGO.MEDIACOM.WRITER-MASC';
        case Role.ID_DIRECTOR:
            return 'HOME.CARGO.ID.CHIEF';
        case Role.ID_RESEARCHER:
            return 'HOME.CARGO.ID.RESEARCHER';
        case Role.FUNDRAISING_DIRECTOR:
            return 'HOME.CARGO.FUNDRAISING.CHIEF';
        case Role.FUNDRAISING_RAISER:
            return 'HOME.CARGO.FUNDRAISING.FUNDRAISER';
        case Role.EDUCATION_DIRECTOR:
            return 'HOME.CARGO.EDUCATION.DIRECTOR';
        case Role.EDUCATION_TUTOR_FEM:
            return 'HOME.CARGO.EDUCATION.TUTORA';
        case Role.EDUCATION_TUTOR_MASC:
            return 'HOME.CARGO.EDUCATION.TUTOR';
        case Role.IT_DIRECTOR:
            return 'HOME.CARGO.IT.DIRECTOR';
        case Role.IT_DEV:
            return 'HOME.CARGO.IT.DEV';
        case Role.RAS_DIRECTOR:
            return 'HOME.CARGO.RAS.DIRECTOR';
        case Role.RAS_DEV:
            return 'HOME.CARGO.RAS.DEV';
        case Role.RAS_RESEARCHER:
            return 'HOME.CARGO.RAS.RESEARCHER';
        default:
            return null;
        }
    }
}
