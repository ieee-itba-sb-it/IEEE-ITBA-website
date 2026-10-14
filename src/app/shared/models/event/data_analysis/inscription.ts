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

export enum StudentType {
    ITBA = 'ITBA',
    SCHOOL = 'SCHOOL',
    UNIVERSITY = 'UNIVERSITY',
    NONE = 'NONE'
}

export const OTHER = 'OTHER';
export const NO_EXPERIENCE = 'NONE';

export const INSCRIPTION_OPTIONS = {
    GENDER: codes('FEMALE', 'MALE', 'OTHER', 'PREFER_NOT_TO_SAY'),
    STUDENT_TYPE: codes(StudentType.ITBA, StudentType.SCHOOL, StudentType.UNIVERSITY, StudentType.NONE),
    SCHOOL_YEAR: codes('PRIMARY_6', 'PRIMARY_7', 'SECONDARY_1', 'SECONDARY_2', 'SECONDARY_3', 'SECONDARY_4', 'SECONDARY_5'),
    CAREER_CATEGORY: codes(
        'ADMINISTRATION', 'AGRONOMY', 'ARCHITECTURE', 'ARTS', 'BIOLOGY', 'EXACT_SCIENCES', 'SOCIAL_SCIENCES',
        'COMPUTING', 'COMMUNICATION', 'LAW', 'DESIGN', 'ECONOMICS', 'EDUCATION', 'PHILOSOPHY', 'ENGINEERING',
        'LITERATURE', 'MEDICINE', 'DENTISTRY', 'PSYCHOLOGY', 'CHEMISTRY', 'VETERINARY', OTHER
    ),
    UNIVERSITY: [
        {value: 'UBA', label: 'Universidad de Buenos Aires (UBA)'},
        {value: 'UTN', label: 'Universidad Tecnológica Nacional (UTN)'},
        {value: 'UNLP', label: 'Universidad Nacional de La Plata (UNLP)'},
        {value: 'UNC', label: 'Universidad Nacional de Córdoba (UNC)'},
        {value: 'UADE', label: 'Universidad Argentina de la Empresa (UADE)'},
        {value: 'UNL', label: 'Universidad Nacional del Litoral (UNL)'},
        {value: 'UNCUYO', label: 'Universidad Nacional de Cuyo (UNCuyo)'},
        {value: 'UCA', label: 'Universidad Católica Argentina (UCA)'},
        {value: 'UTDT', label: 'Universidad Torcuato Di Tella (UTDT)'},
        {value: 'UNSAM', label: 'Universidad Nacional de San Martín (UNSAM)'},
        {value: OTHER}
    ] as InscriptionOption[],
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
    ITBA_YEAR: codes('ADMISSION', 'FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH'),
    WORK_INDUSTRY: codes(
        'ADMINISTRATION', 'AGRICULTURE', 'FOOD', 'ARTS_CULTURE_ENTERTAINMENT', 'CUSTOMER_SERVICE', 'AUTOMOTIVE',
        'CONSTRUCTION', 'ACCOUNTING', 'DEFENSE', 'LAW', 'DIPLOMACY', 'EDUCATION', 'IT', 'REAL_ESTATE',
        'MANUFACTURING', 'ELECTRICAL_MACHINERY', 'MARKETING', 'MATERIALS', 'ENVIRONMENT', 'JOURNALISM',
        'CHEMICAL', 'HEALTH', 'TEXTILE', 'TRANSPORT_TOURISM', 'SALES', OTHER
    ),
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
    studies: {
        studentType: StudentType;
        school?: {
            name: string;
            year: string;
        };
        university?: {
            degree: string;
            careerCategory: string;
            university: string;
            universityOther: string | null;
        };
        itba?: {
            studentId: string;
            career: string;
            year: string;
        };
    };
    work: {
        works: boolean;
        industry: string | null;
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
    submittedAt: Date;
};
