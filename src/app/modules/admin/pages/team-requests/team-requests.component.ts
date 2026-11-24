import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, finalize, Subject, takeUntil} from 'rxjs';
import {AdminService} from '../../../../core/services/admin/admin.service';
import {TeamService} from '../../../../core/services/team/team.service';
import {Commission} from '../../../../shared/models/commission';
import {InternationalText} from '../../../../shared/models/data-types';
import {
    getOptionKey, getRequestStatus, isWebUrl, TeamRequest, TeamRequestAssignment, TeamRequestStatus
} from '../../../../shared/models/team-request';

interface SelectableRequest extends TeamRequest {
    selected: boolean;
    chosenCommission: string;
    chosenPosition: string;
}

interface PositionOption {
    value: string;
    positionId: string;
    positionGender: 'F' | 'M';
    title: InternationalText;
}

const STATUS_KEYS: Record<TeamRequestStatus, string> = {pending: 'PENDING', accepted: 'ACCEPTED', rejected: 'REJECTED'};
const ERROR_PREFIX = 'ADMIN.TEAMREQUESTSTAB.ERRORS.';

@Component({
    selector: 'app-team-requests',
    templateUrl: './team-requests.component.html',
    styleUrls: ['./team-requests.component.css']
})
export class TeamRequestsComponent implements OnInit, OnDestroy {
    requests: SelectableRequest[] = [];
    commissions: Commission[] = [];
    statusFilter: TeamRequestStatus = 'pending';
    requestsOpen = false;
    loading = true;
    processing = false;
    togglingRequests = false;
    error = '';
    notice = '';
    readonly maxReviewedRequests = AdminService.MAX_REVIEWED_REQUESTS;
    readonly statusKeys = STATUS_KEYS;
    readonly isWebUrl = isWebUrl;
    readonly getOptionKey = getOptionKey;
    private readonly destroyed = new Subject<void>();

    constructor(private admin: AdminService, private team: TeamService) {}

    ngOnInit(): void {
        combineLatest([
            this.admin.getTeamRequests(),
            this.team.getAllCommissions(),
            this.team.getIsTeamRequestOpen()
        ]).pipe(takeUntil(this.destroyed)).subscribe({
            next: ([requests, commissions, open]) => {
                const previous = new Map(this.requests.map(request => [request.email, request]));
                this.commissions = commissions;
                this.requestsOpen = open;
                this.requests = requests.map(request => {
                    const previousRequest = previous.get(request.email);
                    const positionId = request.assignedPositionId || request.positionid;
                    return {
                        ...request,
                        selected: getRequestStatus(request) === 'pending' && (previousRequest?.selected ?? false),
                        chosenCommission: previousRequest?.chosenCommission || request.assignedCommissionId || request.commissionid,
                        chosenPosition: previousRequest?.chosenPosition
                            || (positionId ? JSON.stringify([positionId, request.gender || 'M']) : '')
                    };
                }).sort((first, second) => (second.submittedAt?.toMillis() ?? 0) - (first.submittedAt?.toMillis() ?? 0));
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.error = ERROR_PREFIX + 'LOAD';
            }
        });
    }

    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
    }

    get visibleRequests(): SelectableRequest[] {
        return this.requests.filter(request => getRequestStatus(request) === this.statusFilter);
    }

    get selectedRequests(): SelectableRequest[] {
        return this.requests.filter(request => request.selected && getRequestStatus(request) === 'pending');
    }

    get canAccept(): boolean {
        const selected = this.selectedRequests;
        return selected.length > 0 && selected.length <= this.maxReviewedRequests && selected.every(request =>
            this.getPositionOptions(request.chosenCommission, request.gender).some(position => position.value === request.chosenPosition)
        );
    }

    findCommission(id: string): Commission | undefined {
        return this.commissions.find(commission => commission.id === id);
    }

    /** One option per position, split by gender when the position has different titles for each. */
    getPositionOptions(commissionId: string, previousGender?: string): PositionOption[] {
        return (this.findCommission(commissionId)?.positions || []).flatMap(position => {
            const genders: ('F' | 'M')[] = position.title.F.es === position.title.M.es
                ? [previousGender === 'F' ? 'F' : 'M'] : ['F', 'M'];
            return genders.map(positionGender => ({
                value: JSON.stringify([position.id, positionGender]), positionId: position.id,
                positionGender, title: position.title[positionGender]
            }));
        });
    }

    trackPosition(index: number, position: PositionOption): string {
        return position.value;
    }

    getAssignedPositionTitle(request: SelectableRequest): InternationalText | null {
        const position = this.findCommission(request.assignedCommissionId)?.positions
            ?.find(candidate => candidate.id === request.assignedPositionId);
        return position?.title[request.gender === 'F' ? 'F' : 'M'] ?? null;
    }

    onFilterChange(): void {
        this.requests.forEach(request => request.selected = false);
        this.notice = '';
    }

    acceptSelected(): void {
        if (!this.canAccept || this.processing) return;
        const assignments: TeamRequestAssignment[] = this.selectedRequests.map(request => {
            const position = this.getPositionOptions(request.chosenCommission, request.gender)
                .find(option => option.value === request.chosenPosition);
            return {
                email: request.email, commissionId: request.chosenCommission,
                positionId: position.positionId, positionGender: position.positionGender
            };
        });
        this.startProcessing();
        this.admin.acceptTeamRequests(assignments).pipe(
            finalize(() => this.processing = false), takeUntil(this.destroyed)
        ).subscribe({
            next: () => this.notice = 'ADMIN.TEAMREQUESTSTAB.ACCEPTED',
            error: error => this.showError(error)
        });
    }

    rejectSelected(): void {
        const selected = this.selectedRequests;
        if (!selected.length || selected.length > this.maxReviewedRequests || this.processing) return;
        this.startProcessing();
        this.admin.rejectTeamRequests(selected.map(request => request.email)).pipe(
            finalize(() => this.processing = false), takeUntil(this.destroyed)
        ).subscribe({
            next: () => this.notice = 'ADMIN.TEAMREQUESTSTAB.REJECTED',
            error: error => this.showError(error)
        });
    }

    toggleRequestsOpen(): void {
        if (this.togglingRequests) return;
        this.togglingRequests = true;
        this.error = '';
        this.team.setIsTeamRequestOpen(!this.requestsOpen).pipe(
            finalize(() => this.togglingRequests = false), takeUntil(this.destroyed)
        ).subscribe({error: () => this.error = ERROR_PREFIX + 'TOGGLE'});
    }

    private startProcessing(): void {
        this.processing = true;
        this.error = '';
        this.notice = '';
    }

    /** AdminService throws i18n keys; anything else (Firebase errors) gets the generic message. */
    private showError(error: {code?: string; message?: string}): void {
        this.error = !error.code && error.message?.startsWith(ERROR_PREFIX) ? error.message : ERROR_PREFIX + 'PROCESS';
    }
}
