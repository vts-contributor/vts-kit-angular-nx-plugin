import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VtsLayoutModule } from '@ui-vts/ng-vts/layout';
import { RouterModule } from '@angular/router';
import { RouteFacade } from '@vts-kit-ng-nx-demo/share/data-access';
import { VtsBreadCrumbModule } from '@ui-vts/ng-vts/breadcrumb';

@Component({
  selector: 'layout-ui-content',
  standalone: true,
  imports: [CommonModule, VtsLayoutModule, RouterModule, VtsBreadCrumbModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  routeData$ = this.routeFacade.routeData$;
  constructor(private routeFacade: RouteFacade) {}

  ngOnInit(): void {}
}
