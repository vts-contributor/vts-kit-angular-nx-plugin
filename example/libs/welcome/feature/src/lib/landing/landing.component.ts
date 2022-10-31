import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroComponent } from '@vts-kit-ng-nx-demo/welcome/ui';

@Component({
  selector: 'welcome-feature-landing',
  standalone: true,
  imports: [CommonModule, IntroComponent],
  template: ` <welcome-ui-intro></welcome-ui-intro> `,
})
export class LandingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
