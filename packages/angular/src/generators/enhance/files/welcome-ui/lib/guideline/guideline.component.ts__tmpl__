import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'welcome-ui-guideline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <style>
      h2 {
        font-size: 2em;
        color: #73777a;
        position: relative;
      }
      h2::before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateX(calc(-100% - 30px));
        width: 30vw;
        height: 1px;
        background: #73777a;
      }

      h2::after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateX(calc(100% + 30px));
        width: 30vw;
        height: 1px;
        background: #73777a;
      }

      .guide-container {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 40px 0;
      }
    </style>
    <div class="guide-container">
      <h2>Guideline</h2>
      <p>Comming soon</p>
    </div>
  `,
})
export class GuidelineComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
