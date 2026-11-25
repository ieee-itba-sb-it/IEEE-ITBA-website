import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS} from '@angular/material/core';
import {MatDatepickerIntl} from '@angular/material/datepicker';
import {format, parse} from 'date-fns';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import {combineLatest, concatMap, distinctUntilChanged, filter, finalize, of, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {AuthService} from '../../../core/services/authorization/auth.service';
import {TeamService} from '../../../core/services/team/team.service';
import {IEEEuser} from '../../../shared/models/ieee-user/ieee-user';
import {
    COMMISSION_GUIDE_IDS, ExchangePlan, isOption, isWebUrl, OTHER_SOURCE, TEAM_REQUEST_OPTIONS, TeamRequest,
    TeamRequestAnswers
} from '../../../shared/models/team-request';
import {BirthDateAdapter, BirthDatepickerIntl} from './birth-date-picker';

function validateUrl(control: AbstractControl): ValidationErrors | null {
    return !control.value || isWebUrl(control.value.trim()) ? null : {url: true};
}

function validatePastDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const date = control.value;
    return date instanceof Date && !Number.isNaN(date.getTime()) && date <= new Date() ? null : {date: true};
}

@Component({
    selector: 'app-team-request',
    templateUrl: './team-request.component.html',
    styleUrls: ['./team-request.component.css'],
    providers: [
        {provide: DateAdapter, useClass: BirthDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
        {provide: MatDatepickerIntl, useClass: BirthDatepickerIntl}
    ]
})
export class TeamRequestComponent implements OnInit, OnDestroy {
    readonly options = TEAM_REQUEST_OPTIONS;
    readonly commissionGuide = COMMISSION_GUIDE_IDS;
    readonly otherSource = OTHER_SOURCE;
    readonly today = new Date();
    readonly form = this.formBuilder.group({
        firstNames: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
        lastNames: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
        contactEmail: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), Validators.maxLength(254)]],
        studentId: ['', [Validators.required, Validators.pattern(/^\d{1,12}$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^[+]?([ ()-]*[0-9]){7,15}[ ()-]*$/), Validators.maxLength(25)]],
        birthDate: [null as Date | null, [Validators.required, validatePastDate]],
        career: ['', Validators.required],
        yearOfStudy: ['', Validators.required],
        exchangePlan: ['', Validators.required],
        firstCommission: ['', Validators.required],
        secondCommission: [''],
        teamRole: ['', Validators.required],
        works: [null as boolean | null, Validators.required],
        skills: ['', Validators.maxLength(2000)],
        heardAboutIeee: ['', Validators.required],
        otherSourceIeee: ['', Validators.maxLength(200)],
        heardAboutCampaign: ['', Validators.required],
        otherSourceCampaign: ['', Validators.maxLength(200)],
        videoUrl: ['', [validateUrl, Validators.maxLength(2000)]],
        linkedin: ['', [validateUrl, Validators.maxLength(500)]]
    }, {validators: (group: AbstractControl) => {
        const values = group.value;
        if (values.firstCommission && values.firstCommission === values.secondCommission) return {repeatedCommission: true};
        if (values.heardAboutIeee === OTHER_SOURCE && !values.otherSourceIeee?.trim()) return {otherSourceIeee: true};
        if (values.heardAboutCampaign === OTHER_SOURCE && !values.otherSourceCampaign?.trim()) return {otherSourceCampaign: true};
        return null;
    }});

    user: IEEEuser | null = null;
    commissions: string[] = [];
    requestsOpen = false;
    loading = true;
    loadingRequest = true;
    loadFailed = false;
    submitting = false;
    processingPhoto = false;
    verifying = false;
    editing = false;
    submitAttempted = false;
    photo: string | null = null;
    pictureType: string;
    request: TeamRequest | null = null;
    error = '';
    notice = '';
    knowsCommission: boolean | null = null;
    private readonly destroyed = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private team: TeamService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        combineLatest([this.team.getAllCommissions(), this.team.getIsTeamRequestOpen()])
            .pipe(takeUntil(this.destroyed)).subscribe({
                next: ([commissions, open]) => {
                    this.commissions = this.commissionGuide.filter(id =>
                        commissions.some(commission => commission.id === id && commission.positions?.length)
                    );
                    this.requestsOpen = open;
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                    this.loadFailed = true;
                    this.error = 'TEAM_REQUEST.ERRORS.LOAD';
                }
            });
        this.auth.getCurrentUser().pipe(
            tap(user => {
                if (user && !this.user) {
                    this.photo = user.photoURL;
                    this.form.patchValue({linkedin: user.linkedin || '', contactEmail: user.email});
                }
                this.user = user;
            }),
            filter(user => !!user),
            distinctUntilChanged((previous, current) => previous.email === current.email),
            switchMap(user => this.team.getTeamRequest(user.email)),
            takeUntil(this.destroyed)
        ).subscribe({
            next: request => {
                this.request = request;
                this.loadingRequest = false;
                if (request?.status === 'accepted') this.editing = false;
            },
            error: () => {
                this.loadingRequest = false;
                this.loadFailed = true;
                this.error = 'TEAM_REQUEST.ERRORS.LOAD_REQUEST';
            }
        });
        if (this.route.snapshot.queryParamMap.get('verified') === 'true') this.checkEmail();
    }

    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
    }

    onFirstCommissionChange(): void {
        if (this.form.value.firstCommission === this.form.value.secondCommission) {
            this.form.patchValue({secondCommission: ''});
        }
    }

    editRequest(): void {
        if (!this.request || this.request.status === 'accepted') return;
        const answers = this.request.answers;
        if (answers) {
            const ieeeIsOption = isOption('MEDIA', answers.heardAboutIeee);
            const campaignIsOption = isOption('MEDIA', answers.heardAboutCampaign);
            this.form.patchValue({
                ...answers,
                phone: parsePhoneNumberFromString(answers.phone, 'AR')?.number || answers.phone,
                birthDate: parse(answers.birthDate, 'yyyy-MM-dd', new Date()),
                heardAboutIeee: ieeeIsOption ? answers.heardAboutIeee : OTHER_SOURCE,
                otherSourceIeee: ieeeIsOption ? '' : answers.heardAboutIeee,
                heardAboutCampaign: campaignIsOption ? answers.heardAboutCampaign : OTHER_SOURCE,
                otherSourceCampaign: campaignIsOption ? '' : answers.heardAboutCampaign,
                videoUrl: answers.videoUrl || ''
            });
        }
        this.form.patchValue({
            contactEmail: answers?.contactEmail || this.request.email,
            firstCommission: this.request.commissionid,
            secondCommission: this.request.secondCommissionId || '',
            linkedin: this.request.linkedin || ''
        });
        this.photo = this.request.photo;
        this.editing = true;
        this.notice = '';
    }

    submitRequest(): void {
        this.submitAttempted = true;
        this.form.markAllAsTouched();
        if (this.form.invalid || this.submitting || this.processingPhoto || !this.user?.verifiedEmail || !this.requestsOpen
            || this.loadingRequest || this.loadFailed || this.request?.status === 'accepted') return;
        const values = this.form.getRawValue();
        const commissionExists = (id: string) => this.commissions.includes(id);
        if (!commissionExists(values.firstCommission) || (values.secondCommission && !commissionExists(values.secondCommission))) {
            this.error = 'TEAM_REQUEST.ERRORS.UNAVAILABLE_COMMISSION';
            return;
        }
        this.error = '';
        this.notice = '';
        this.submitting = true;
        const answers: TeamRequestAnswers = {
            firstNames: values.firstNames.trim(), lastNames: values.lastNames.trim(),
            contactEmail: values.contactEmail.trim(),
            studentId: values.studentId.trim(), phone: values.phone.trim(),
            birthDate: format(values.birthDate, 'yyyy-MM-dd'), career: values.career, yearOfStudy: values.yearOfStudy,
            exchangePlan: values.exchangePlan as ExchangePlan, teamRole: values.teamRole, works: values.works,
            skills: values.skills.trim(),
            heardAboutIeee: values.heardAboutIeee === OTHER_SOURCE ? values.otherSourceIeee.trim() : values.heardAboutIeee,
            heardAboutCampaign: values.heardAboutCampaign === OTHER_SOURCE ? values.otherSourceCampaign.trim() : values.heardAboutCampaign,
            videoUrl: values.videoUrl.trim() || null
        };
        const profile = {...this.user, fullname: `${answers.firstNames} ${answers.lastNames}`, linkedin: values.linkedin.trim() || null};
        const photoChanged = this.photo !== this.user.photoURL && (!this.photo || this.photo.startsWith('data:'));
        const photoUpload = photoChanged ? this.auth.updateProfilePic(this.photo, this.pictureType) : of(this.photo);
        this.auth.ensureVerifiedToken().pipe(
            concatMap(() => photoUpload),
            concatMap(photo => {
                profile.photoURL = photo;
                return this.auth.updateProfile(profile);
            }),
            concatMap(() => this.team.submitTeamRequest({
                name: profile.fullname, email: profile.email, photo: profile.photoURL, linkedin: profile.linkedin,
                gender: this.request?.gender ?? null, commissionid: values.firstCommission, positionid: null,
                secondCommissionId: values.secondCommission || null, answers
            })),
            finalize(() => this.submitting = false),
            takeUntil(this.destroyed)
        ).subscribe({
            next: () => {
                this.editing = false;
                this.notice = 'TEAM_REQUEST.FOOTER.SENT';
            },
            error: (error: Error) => this.error = error?.message === TeamService.REQUEST_ALREADY_ACCEPTED
                ? 'TEAM_REQUEST.ERRORS.ALREADY_ACCEPTED' : 'TEAM_REQUEST.ERRORS.SEND'
        });
    }

    sendVerificationEmail(): void {
        if (this.verifying) return;
        this.verifying = true;
        const returnUrl = new URL(window.location.href);
        returnUrl.searchParams.set('verified', 'true');
        this.auth.sendVerificationEmail(returnUrl.toString()).pipe(
            finalize(() => this.verifying = false), takeUntil(this.destroyed)
        ).subscribe({
            next: () => this.notice = 'TEAM_REQUEST.VERIFY.SENT',
            error: () => this.error = 'TEAM_REQUEST.VERIFY.SEND_ERROR'
        });
    }

    checkEmail(): void {
        if (this.verifying) return;
        this.verifying = true;
        this.auth.reloadToken().pipe(finalize(() => this.verifying = false), takeUntil(this.destroyed)).subscribe({
            next: verified => {
                if (this.user) this.user = {...this.user, verifiedEmail: verified};
                this.notice = verified ? 'TEAM_REQUEST.VERIFY.VERIFIED' : 'TEAM_REQUEST.VERIFY.NOT_VERIFIED';
                void this.router.navigate([], {queryParams: {verified: null}, queryParamsHandling: 'merge', replaceUrl: true});
            },
            error: () => this.error = 'TEAM_REQUEST.VERIFY.CHECK_ERROR'
        });
    }
}
