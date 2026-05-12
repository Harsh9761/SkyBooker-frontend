// import { TestBed } from '@angular/core/testing';
// import { App } from './app';

// describe('App', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [App],
//     }).compileComponents();
//   });

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(App);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   it('should render title', async () => {
//     const fixture = TestBed.createComponent(App);
//     await fixture.whenStable();
//     const compiled = fixture.nativeElement as HTMLElement;
//     expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
//   });
// });


import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] //app-navbar ignore karne ke liye
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render navbar', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navbar = compiled.querySelector('app-navbar');

    expect(navbar).not.toBeNull(); // correct check
  });
});