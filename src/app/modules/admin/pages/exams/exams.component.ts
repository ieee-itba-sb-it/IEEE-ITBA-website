import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from 'src/app/core/services/event/event.service';
import { DataAnalysisStudentRow, StudentStatus } from 'src/app/shared/models/event/data_analysis/exams';
import {
    AGE_RANGES,
    DataAnalysisMetricField,
    DataAnalysisMetrics,
    INSCRIPTION_OPTIONS,
    InscriptionOptionGroup,
    Occupation,
    OTHER
} from 'src/app/shared/models/event/data_analysis/inscription';

type MetricBar = {
    label: string;
    count: number;
    // Share of the people who could answer the question (0-100)
    percentage: number;
};

type MetricChart = {
    field: DataAnalysisMetricField;
    multipleChoice: boolean;
    bars: MetricBar[];
};

type MetricChartConfig = {
    field: DataAnalysisMetricField;
    // Options shown even when nobody chose them; without it only the answered codes are shown
    optionGroup?: InscriptionOptionGroup;
    multipleChoice?: boolean;
    // Keep the options order instead of sorting by count (e.g. age ranges)
    ordinal?: boolean;
};

const METRIC_CHARTS: MetricChartConfig[] = [
    {field: 'occupation', optionGroup: 'OCCUPATION'},
    {field: 'itbaCareer', optionGroup: 'ITBA_CAREER'},
    {field: 'ageRange', ordinal: true},
    {field: 'gender', optionGroup: 'GENDER'},
    {field: 'country'},
    {field: 'referralSource', optionGroup: 'REFERRAL_SOURCE'},
    {field: 'motivation', optionGroup: 'MOTIVATION', multipleChoice: true},
    {field: 'programmingLanguage', optionGroup: 'PROGRAMMING_LANGUAGE', multipleChoice: true},
    {field: 'pythonInterest', optionGroup: 'PYTHON_INTEREST', multipleChoice: true}
];

@Component({
    selector: 'app-exams-admin',
    templateUrl: './exams.component.html',
    styleUrls: ['./exams.component.css']
})
export class ExamsAdminComponent implements OnInit {
    readonly StudentStatus = StudentStatus;

    editions?: string[];
    currentEdition: string | null = null;
    selectedEdition: string | null = null;

    students?: DataAnalysisStudentRow[];
    metrics?: DataAnalysisMetrics | null;
    charts: MetricChart[] = [];

    constructor(
        private eventService: EventService,
        private snackBar: MatSnackBar,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.eventService.getDataAnalysisEditions().subscribe({
            next: ({editions, current}) => {
                this.editions = editions;
                this.currentEdition = current;
                const initialEdition = current ?? editions[0] ?? null;
                if (initialEdition) this.selectEdition(initialEdition);
            },
            error: () => {
                this.editions = [];
                this.showError('ADMIN.EXAMSTAB.ERRORS.EDITIONS');
            }
        });
    }

    selectEdition(editionId: string): void {
        this.selectedEdition = editionId;
        this.students = undefined;
        this.metrics = undefined;

        this.eventService.getDataAnalysisEditionStudents(editionId).subscribe({
            next: students => {
                // Ignore responses of an edition that is no longer selected
                if (editionId !== this.selectedEdition) return;
                this.students = [...students].sort((a, b) =>
                    `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`));
            },
            error: () => {
                this.students = [];
                this.showError('ADMIN.EXAMSTAB.ERRORS.STUDENTS');
            }
        });

        this.eventService.getDataAnalysisMetrics(editionId).subscribe({
            next: metrics => {
                if (editionId !== this.selectedEdition) return;
                this.metrics = metrics;
                this.charts = metrics ? this.buildCharts(metrics) : [];
            },
            error: () => {
                this.metrics = null;
                this.charts = [];
                this.showError('ADMIN.EXAMSTAB.ERRORS.METRICS');
            }
        });
    }

    countByStatus(status: StudentStatus): number {
        return this.students?.filter(student => student.status === status).length ?? 0;
    }

    statusLabel(status: StudentStatus): string {
        return `ADMIN.EXAMSTAB.STATUS.${status}`;
    }

    barTooltip(bar: MetricBar): string {
        return this.translate.instant('ADMIN.EXAMSTAB.METRICS.BAR_TOOLTIP', {
            label: bar.label, count: bar.count, percentage: bar.percentage
        });
    }

    private buildCharts(metrics: DataAnalysisMetrics): MetricChart[] {
        return METRIC_CHARTS
            .map(config => this.buildChart(config, metrics))
            .filter(chart => chart.bars.length > 0);
    }

    private buildChart(config: MetricChartConfig, metrics: DataAnalysisMetrics): MetricChart {
        const counts = metrics[config.field] ?? {};
        // Only ITBA students answer their career
        const respondents = config.field === 'itbaCareer' ? (metrics.occupation?.[Occupation.ITBA] ?? 0) : metrics.total;

        const optionCodes = config.ordinal
            ? AGE_RANGES.map(range => range.label)
            : (config.optionGroup ? INSCRIPTION_OPTIONS[config.optionGroup].map(option => option.value) : []);
        const codes = Array.from(new Set([...optionCodes, ...Object.keys(counts)]));

        const bars = codes.map(code => {
            const count = counts[code] ?? 0;
            return {
                label: this.optionLabel(config, code),
                count,
                percentage: respondents > 0 ? Math.round(count / respondents * 100) : 0
            };
        });

        return {
            field: config.field,
            multipleChoice: !!config.multipleChoice,
            bars: config.ordinal ? bars : bars.sort((a, b) => b.count - a.count)
        };
    }

    private optionLabel(config: MetricChartConfig, code: string): string {
        if (config.field === 'country') return this.countryName(code);
        if (config.ordinal) return code;

        const option = config.optionGroup
            ? INSCRIPTION_OPTIONS[config.optionGroup].find(groupOption => groupOption.value === code)
            : undefined;
        if (option?.label) return option.label;
        // "Other" texts are only counted, and most groups have no option of their own for them
        if (!option && code === OTHER) return this.translate.instant('DATAANALYSIS.INSCRIPTION.FIELDS.OTHER');
        return this.translate.instant(`DATAANALYSIS.INSCRIPTION.OPTIONS.${config.optionGroup}.${code}`);
    }

    private countryName(code: string): string {
        try {
            const displayNames = new (Intl as any).DisplayNames([this.translate.currentLang || 'es'], {type: 'region'});
            return displayNames.of(code) ?? code;
        } catch {
            return code;
        }
    }

    private showError(key: string): void {
        this.snackBar.open(this.translate.instant(key), this.translate.instant('ADMIN.EXAMSTAB.CLOSE'), {duration: 4000});
    }
}
