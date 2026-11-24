import {Timestamp} from '@angular/fire/firestore';
import {TeamMember} from './team-member';

export type TeamRequestStatus = 'pending' | 'accepted' | 'rejected';

/**
 * Option codes stored in Firestore. firestore.rules validates them against the same lists, so both must change together.
 * Each code is translated with the key TEAM_REQUEST.OPTIONS.<group>.<code>.
 */
export const TEAM_REQUEST_OPTIONS = {
    CAREERS: [
        'BUSINESS_ANALYTICS', 'BUSINESS_MANAGEMENT', 'BIOENGINEERING', 'ELECTRONICS', 'INDUSTRIAL', 'COMPUTER',
        'MECHANICAL', 'NAVAL', 'PETROLEUM', 'CHEMICAL', 'CIVIL', 'BIOTECHNOLOGY'
    ],
    YEARS: ['ADMISSION', 'FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'GRADUATE'],
    EXCHANGE: ['YES', 'NO', 'MAYBE'],
    ROLES: ['LEADER', 'COORDINATOR', 'TEAM_PLAYER', 'FORMAL_MEMBER', 'BACKSTAGE'],
    MEDIA: ['ACQUAINTANCE', 'INSTAGRAM', 'PYTHON_COURSE', 'CAMPUS', 'YOUTUBE', 'LINKEDIN', 'WEBSITE', 'OTHER']
} as const;

export type TeamRequestOptionGroup = keyof typeof TEAM_REQUEST_OPTIONS;
export type ExchangePlan = typeof TEAM_REQUEST_OPTIONS.EXCHANGE[number];

/** Selecting this source asks for free text, which is stored instead of the code. */
export const OTHER_SOURCE = 'OTHER';

/** Commissions described in the form's guide; their texts live in TEAM_REQUEST.COMMISSIONS.<id>. */
export const COMMISSION_GUIDE_IDS = ['EDU', 'FR', 'MEDIA', 'TI', 'RAS'];

export interface TeamRequestAnswers {
    firstNames: string;
    lastNames: string;
    contactEmail: string;
    studentId: string;
    phone: string;
    birthDate: string;
    career: string;
    yearOfStudy: string;
    exchangePlan: ExchangePlan;
    teamRole: string;
    works: boolean;
    skills: string;
    heardAboutIeee: string;
    heardAboutCampaign: string;
    videoUrl: string | null;
}

export interface TeamRequest extends Omit<TeamMember, 'positionid' | 'gender'> {
    gender?: string | null;
    positionid: string | null;
    secondCommissionId?: string | null;
    answers?: TeamRequestAnswers;
    status?: TeamRequestStatus;
    submittedAt?: Timestamp;
    reviewedAt?: Timestamp;
    assignedCommissionId?: string;
    assignedPositionId?: string;
}

export interface TeamRequestAssignment {
    email: string;
    commissionId: string;
    positionId: string;
    positionGender: 'F' | 'M';
}

/** Requests created with the previous form have no status and count as pending. */
export function getRequestStatus(request: TeamRequest): TeamRequestStatus {
    return request.status ?? 'pending';
}

export function isOption(group: TeamRequestOptionGroup, value: string): boolean {
    return (TEAM_REQUEST_OPTIONS[group] as readonly string[]).includes(value);
}

/** i18n key for a stored answer, or null when it is free text (the "Other" answer). */
export function getOptionKey(group: TeamRequestOptionGroup, value: string, labels: string = group): string | null {
    return isOption(group, value) ? `TEAM_REQUEST.OPTIONS.${labels}.${value}` : null;
}

export function isWebUrl(value: string): boolean {
    if (/\s/.test(value)) return false;
    try {
        const url = new URL(value);
        return ['https:', 'http:'].includes(url.protocol) && !!url.hostname
            && !url.username && !url.password;
    } catch {
        return false;
    }
}

export function toPublicMember(request: TeamRequest, assignment: TeamRequestAssignment): TeamMember {
    return {
        name: request.name,
        email: assignment.email,
        gender: assignment.positionGender,
        photo: request.photo ?? null,
        linkedin: request.linkedin ?? null,
        commissionid: assignment.commissionId,
        positionid: assignment.positionId
    };
}
