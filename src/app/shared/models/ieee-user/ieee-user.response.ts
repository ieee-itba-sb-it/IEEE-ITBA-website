import {CommissionType, Gender, Role} from './ieee-team.enums';

export interface IEEEUserResponse {
    name: string;
    photo: string;
    linkedin?: string;
    mail?: string;
    role?: Role;
    commission: CommissionType;
    gender: Gender;
}
