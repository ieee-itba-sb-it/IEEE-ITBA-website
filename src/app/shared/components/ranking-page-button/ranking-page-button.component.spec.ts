import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref } from '@angular/router';
import { RankingPageButtonComponent } from './ranking-page-button.component';
import { AppConfigService } from '../../../core/services/configuration/app-config.service';

class AppConfigServiceStub {
    getAppColors() { return of({ background: '#000000' }); }
}

describe('RankingPageButtonComponent', () => {
    let component: RankingPageButtonComponent;
    let fixture: ComponentFixture<RankingPageButtonComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [RankingPageButtonComponent],
            providers: [{ provide: AppConfigService, useClass: AppConfigServiceStub }]
    });

    fixture = TestBed.createComponent(RankingPageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose app colors observable', (done) => {
    component.getAppColors().subscribe(colors => {
      expect(colors).toBeTruthy();
      expect(colors.background).toBeDefined();
      done();
    });
  });

  it('should use the rankingPath input for routerLink', () => {
    component.rankingPath = '/custom-ranking';
    fixture.detectChanges();

    const linkDebugEl = fixture.debugElement.query(By.directive(RouterLinkWithHref));
    const routerLinkInstance = linkDebugEl.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['/custom-ranking']);
  });
});
