import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VtsMenuModule } from '@ui-vts/ng-vts/menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'layout-ui-topbar',
  standalone: true,
  imports: [CommonModule, VtsMenuModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
