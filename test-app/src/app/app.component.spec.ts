import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PiyoComponent } from './piyo/piyo.component';
import { AppModule } from './app.module';

describe('2 comp in declarations', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PiyoComponent,
      ],
    }).compileComponents();
  }));

  it('should be run with zombie compiler', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture).toBeTruthy();
  });

  it('should be re-run with zombie compiler', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture).toBeTruthy();
  });
});

describe('1 comp in declarations', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PiyoComponent,
      ],
    }).compileComponents();
  }));

  it('should be run with zombie compiler', () => {
    const fixture = TestBed.createComponent(PiyoComponent);
    expect(fixture).toBeTruthy();
  });

  it('should be re-run with zombie compiler', () => {
    const fixture = TestBed.createComponent(PiyoComponent);
    expect(fixture).toBeTruthy();
  });
});

describe('import', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
  }));

  it('should be run with zombie compiler', () => {
    const fixture = TestBed.createComponent(PiyoComponent);
    expect(fixture).toBeTruthy();
  });

  it('should be re-run with zombie compiler', () => {
    const fixture = TestBed.createComponent(PiyoComponent);
    expect(fixture).toBeTruthy();
  });
});

describe('override', () => {
  describe("first", () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          PiyoComponent,
        ],
      })
      .overrideTemplate(PiyoComponent, '<div class="override">PIYO</div>')
      .compileComponents()
      ;
    }));

    it('should be run with zombie compiler', () => {
      TestBed
      const fixture = TestBed.createComponent(PiyoComponent);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.override'))).toBeTruthy();
    });
  });

  describe("second", () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          PiyoComponent,
        ],
      }).compileComponents();
    }));

    it('should be re-run with zombie compiler', () => {
      TestBed
      const fixture = TestBed.createComponent(PiyoComponent);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.original_piyo'))).toBeTruthy();
    });
  });
});
