import {IEEEuser} from "../../ieee-user/ieee-user";

// Option values are stored as codes; labels live in i18n under DATAANALYSIS.INSCRIPTION.OPTIONS.<GROUP>.<CODE>
// unless the option defines a literal label (proper names that are not translated).

export type InscriptionOption = {
    value: string;
    label?: string;
};

const codes = (...values: string[]): InscriptionOption[] => values.map(value => ({value}));

export const TERMS_AND_CONDITIONS_URL = 'http://bit.ly/TyCIEEE';
export const MIN_AGE = 12;
export const MAX_PYTHON_INTERESTS = 3;

export enum Occupation {
    SCHOOL = 'SCHOOL',
    ITBA = 'ITBA',
    UNIVERSITY = 'UNIVERSITY',
    WORK = 'WORK',
    NONE = 'NONE'
}

export const OTHER = 'OTHER';
export const NO_EXPERIENCE = 'NONE';

export const INSCRIPTION_OPTIONS = {
    GENDER: codes('FEMALE', 'MALE', 'OTHER', 'PREFER_NOT_TO_SAY'),
    OCCUPATION: codes(Occupation.SCHOOL, Occupation.ITBA, Occupation.UNIVERSITY, Occupation.WORK, Occupation.NONE),
    ITBA_CAREER: [
        {value: 'BUSINESS_SOCIAL_ANALYTICS', label: 'Licenciatura en Analítica Empresarial y Social'},
        {value: 'BUSINESS_TECHNOLOGY', label: 'Licenciatura en Negocios y Tecnología'},
        {value: 'BEHAVIORAL_SCIENCES', label: 'Licenciatura en Ciencias del Comportamiento'},
        {value: 'BIOENGINEERING', label: 'Bioingeniería'},
        {value: 'BIOTECHNOLOGY', label: 'Biotecnología'},
        {value: 'ELECTRONIC_ENGINEERING', label: 'Ingeniería Electrónica'},
        {value: 'INDUSTRIAL_ENGINEERING', label: 'Ingeniería Industrial'},
        {value: 'COMPUTER_ENGINEERING', label: 'Ingeniería Informática'},
        {value: 'MECHANICAL_ENGINEERING', label: 'Ingeniería Mecánica'},
        {value: 'NAVAL_ENGINEERING', label: 'Ingeniería Naval'},
        {value: 'PETROLEUM_ENGINEERING', label: 'Ingeniería en Petróleo'},
        {value: 'CHEMICAL_ENGINEERING', label: 'Ingeniería Química'},
        {value: 'POSTGRADUATE', label: 'Posgrado'}
    ] as InscriptionOption[],
    REFERRAL_SOURCE: codes(
        'FRIEND', 'INSTAGRAM', 'REDDIT', 'LINKEDIN', 'FACEBOOK', 'WHATSAPP', 'MAIL', 'UNIVERSITY', 'WORK',
        'IEEE_ENOTICE', OTHER
    ),
    MOTIVATION: codes('CURRENT_JOB', 'PERSONAL_INTEREST', 'PROFESSIONAL_DEVELOPMENT'),
    PROGRAMMING_LANGUAGE: [
        {value: 'C', label: 'C'},
        {value: 'CPP', label: 'C++'},
        {value: 'CSHARP', label: 'C#'},
        {value: 'PYTHON', label: 'Python'},
        {value: 'JAVA', label: 'Java'},
        {value: 'PHP', label: 'PHP'},
        {value: 'JAVASCRIPT', label: 'JavaScript'},
        {value: 'RUBY', label: 'Ruby'},
        {value: 'GO', label: 'Go'},
        {value: NO_EXPERIENCE}
    ] as InscriptionOption[],
    PYTHON_INTEREST: codes(
        'DATA_ANALYSIS', 'MACHINE_LEARNING', 'WEB_DEVELOPMENT', 'GAME_DESIGN', 'CIRCUIT_DESIGN', 'COMPUTER_VISION',
        'DESIGN_3D'
    )
} as const;

export type InscriptionOptionGroup = keyof typeof INSCRIPTION_OPTIONS;

// ISO 3166-1 alpha-2 codes; names are resolved at runtime with Intl.DisplayNames in the current language
export const COUNTRY_CODES = [
    'AD', 'AE', 'AF', 'AG', 'AL', 'AM', 'AO', 'AR', 'AT', 'AU', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH',
    'BI', 'BJ', 'BN', 'BO', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CL', 'CM',
    'CN', 'CO', 'CR', 'CU', 'CV', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'ER', 'ES',
    'ET', 'FI', 'FJ', 'FM', 'FR', 'GA', 'GB', 'GD', 'GE', 'GH', 'GM', 'GN', 'GQ', 'GR', 'GT', 'GW', 'GY', 'HK',
    'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IN', 'IQ', 'IR', 'IS', 'IT', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH',
    'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY',
    'MA', 'MC', 'MD', 'ME', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MR', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY',
    'MZ', 'NA', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NZ', 'OM', 'PA', 'PE', 'PG', 'PH', 'PK', 'PL', 'PR',
    'PS', 'PT', 'PW', 'PY', 'QA', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SI', 'SK', 'SL',
    'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SY', 'SZ', 'TD', 'TG', 'TH', 'TJ', 'TL', 'TM', 'TN', 'TO', 'TR',
    'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VN', 'VU', 'WS', 'YE', 'ZA', 'ZM',
    'ZW'
];

// Ages are only stored as ranges in the metrics
export const AGE_RANGES: { label: string; max: number }[] = [
    {label: '12-17', max: 17},
    {label: '18-24', max: 24},
    {label: '25-34', max: 34},
    {label: '35-44', max: 44},
    {label: '45+', max: Infinity}
];

export const getAgeRange = (age: number): string =>
    AGE_RANGES.find(range => age <= range.max).label;

// The edition is derived from the inscription start date: January-July is "YYYY-1C", August-December "YYYY-2C"
export const getEditionId = (inscriptionStart: Date): string =>
    `${inscriptionStart.getFullYear()}-${inscriptionStart.getMonth() < 7 ? '1C' : '2C'}`;

// Anonymous counters of an edition: each field maps an option code to the amount of people that chose it
export type DataAnalysisMetrics = {
    total: number;
    gender: Record<string, number>;
    ageRange: Record<string, number>;
    country: Record<string, number>;
    occupation: Record<string, number>;
    itbaCareer: Record<string, number>;
    referralSource: Record<string, number>;
    motivation: Record<string, number>;
    programmingLanguage: Record<string, number>;
    pythonInterest: Record<string, number>;
};

export type DataAnalysisMetricField = Exclude<keyof DataAnalysisMetrics, 'total'>;

// Option codes an inscription adds to each metric. Only codes are counted: exact ages and "other" texts are never
// stored. Fields without values (e.g. the ITBA career of non ITBA students) are left out
export const getInscriptionMetricValues = (
    inscription: DataAnalysisInscription
): Partial<Record<DataAnalysisMetricField, string[]>> => {
    const {personal, occupation, interests} = inscription;
    const withOther = (selected: string[], other: string | null) => other ? [...selected, OTHER] : selected;

    const values: Record<DataAnalysisMetricField, (string | null)[]> = {
        gender: [personal.gender],
        ageRange: [getAgeRange(personal.age)],
        country: [personal.country],
        occupation: [occupation.occupation],
        itbaCareer: [occupation.itbaCareer],
        referralSource: [interests.referralSource],
        motivation: withOther(interests.motivations, interests.motivationOther),
        programmingLanguage: withOther(interests.programmingLanguages, interests.programmingLanguageOther),
        pythonInterest: withOther(interests.pythonInterests, interests.pythonInterestOther)
    };

    return (Object.keys(values) as DataAnalysisMetricField[])
        .map(field => [field, values[field].filter(value => !!value)] as const)
        .filter(([, fieldValues]) => fieldValues.length > 0)
        .reduce((result, [field, fieldValues]) => ({...result, [field]: fieldValues}), {});
};

export class InscriptionClosedError extends Error {
    constructor() {
        super('The data analysis inscription is closed');
    }
}

export class AlreadyEnrolledError extends Error {
    constructor() {
        super('The user is already enrolled in this edition');
    }
}

export type DataAnalysisInscriptionStatus = {
    user: IEEEuser | null;
    enrolled: boolean;
    open: boolean;
    end: Date | null;
};

export type DataAnalysisInscription = {
    email: string;
    personal: {
        firstName: string;
        lastName: string;
        age: number;
        gender: string;
        country: string;
    };
    occupation: {
        occupation: Occupation;
        itbaCareer: string | null;
    };
    interests: {
        referralSource: string;
        motivations: string[];
        motivationOther: string | null;
        programmingLanguages: string[];
        programmingLanguageOther: string | null;
        pythonInterests: string[];
        pythonInterestOther: string | null;
        linkedin: string | null;
    };
    consents: {
        termsAccepted: boolean;
        sponsorDataSharing: boolean;
    };
};
