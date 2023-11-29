export enum Role {
    OFFICER = 'OFFICER',
    DIRECTOR = 'DIRECTOR',
    CC = 'CC',
    ILLUSTRATOR = 'ILLUSTRATOR',
    WRITER = 'WRITER',
    RESEARCHER = 'RESEARCHER',
    FUNDRAISER = 'FUNDRAISER',
    TUTOR = 'TUTOR',
    DEV = 'DEV',
    DESIGNER = 'DESIGNER',
    SECRETARY = 'SECRETARY',
    TREASURER = 'TREASURER',
    VP = 'VP'
}

export enum CommissionType {
    CD = 'CD',
    MEDIACOM = 'MEDIACOM',
    ID = 'ID',
    FUNDRAISING = 'FUNDRAISING',
    EDUCATION = 'EDUCATION',
    IT = 'IT',
    RAS = 'RAS',
    EMB = 'EMB'
}

export const ROLE_ORDER = Object.values(Role);

export const COMMISSION_ORDER = Object.values(CommissionType);

export enum Gender {
    'F' = 'F',
    'M' = 'M',
}
