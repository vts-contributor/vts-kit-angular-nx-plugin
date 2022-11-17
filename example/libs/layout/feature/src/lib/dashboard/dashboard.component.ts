import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ContentComponent,
  SiderComponent,
  TopbarComponent,
} from '@vts-kit-ng-nx-demo/layout/ui';
import { VtsLayoutModule } from '@ui-vts/ng-vts/layout';

@Component({
  selector: 'layout-feature-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    VtsLayoutModule,
    TopbarComponent,
    ContentComponent,
    SiderComponent,
  ],
  template: `
    <vts-layout>
      <vts-header>
        <layout-ui-topbar></layout-ui-topbar>
      </vts-header>
      <vts-layout>
        <vts-sider>
          <layout-ui-sider></layout-ui-sider>
        </vts-sider>
        <vts-layout>
          <layout-ui-content></layout-ui-content>
        </vts-layout>
      </vts-layout>
    </vts-layout>
  `,
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
