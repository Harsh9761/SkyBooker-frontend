import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FlightService } from '../../services/flight.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';


describe('DashboardComponent (Jest)', () => {

  let flightServiceMock: any;
  let authServiceMock: any;

  beforeEach(async () => {

    flightServiceMock = {
      searchFlights: jest.fn().mockReturnValue(of([]))
    };

    authServiceMock = {
      logout: jest.fn(),
      isLoggedIn: jest.fn().mockReturnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),

        { provide: FlightService, useValue: flightServiceMock },
        { provide: AuthService, useValue: authServiceMock },

        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();
  });

  it('should create dashboard component', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should call searchFlights on search()', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;

    component.origin = 'Delhi';
    component.dest = 'Mumbai';
    component.date = '2026-05-06';

    component.search();

    expect(flightServiceMock.searchFlights)
      .toHaveBeenCalledWith('Delhi', 'Mumbai', '2026-05-06');
  });

  it('should logout user', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;

    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});