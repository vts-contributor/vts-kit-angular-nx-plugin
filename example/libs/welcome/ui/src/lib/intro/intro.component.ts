import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VtsButtonModule } from '@ui-vts/ng-vts/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'welcome-ui-intro',
  standalone: true,
  imports: [CommonModule, VtsButtonModule, RouterModule],
  template: `
    <style>
      :host {
        display: block;
      }

      body {
        margin: 0;
      }

      .intro-header {
        position: relative;
        text-align: center;
        background: linear-gradient(
          60deg,
          rgba(238, 0, 51, 1) 0%,
          rgba(0, 172, 193, 1) 100%
        );

        color: white;
        max-height: 100vh;
        overflow: hidden;
      }

      .inner-header {
        height: 80vh;
        width: 100%;
        margin: 0;
        padding: 0;
        flex-direction: column;
      }

      .inner-header h1 {
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        letter-spacing: 2px;
        font-size: 36px;
        color: inherit;
        margin-top: 0.5em;
      }

      .inner-header p {
        font-family: 'Lato', sans-serif;
        letter-spacing: 1px;
        font-size: 14px;
        color: #333333;
      }

      .wave-container {
        height: 20vh;
        display: flex;
        align-items: flex-end;
      }

      .flex {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }

      .waves {
        position: relative;
        width: 100%;
        margin-bottom: -7px;
        min-height: 100px;
        max-height: 200px;
      }

      .content {
        position: relative;
        height: 20vh;
        text-align: center;
        background-color: white;
      }

      /* Animation */

      .parallax > use {
        animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
      }
      .parallax > use:nth-child(1) {
        animation-delay: -2s;
        animation-duration: 7s;
      }
      .parallax > use:nth-child(2) {
        animation-delay: -3s;
        animation-duration: 10s;
      }
      .parallax > use:nth-child(3) {
        animation-delay: -4s;
        animation-duration: 13s;
      }
      .parallax > use:nth-child(4) {
        animation-delay: -5s;
        animation-duration: 20s;
      }
      @keyframes move-forever {
        0% {
          transform: translate3d(-90px, 0, 0);
        }
        100% {
          transform: translate3d(85px, 0, 0);
        }
      }
      /*Shrinking for mobile*/
      @media (max-width: 768px) {
        .waves {
          height: 40px;
          min-height: 40px;
        }
        .content {
          height: 30vh;
        }
        h1 {
          font-size: 24px;
        }
      }
    </style>

    <div class="intro-header">
      <div class="inner-header flex">
        <svg
          width="69"
          height="52"
          viewBox="0 0 43 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36.8872 0C34.6172 0 32.7256 1.34907 31.8068 3.29173L22.2945 23.4738C22.0783 23.9595 21.6189 24.715 21.2406 24.715C20.8622 24.715 20.4298 23.9325 20.1866 23.4738L10.6203 3.29173C9.70147 1.34907 7.80982 0 5.53984 0H0L15.1332 29.1939C16.6195 32.0539 19.7002 31.9999 21.2676 31.9999C23.4295 31.9999 25.9697 31.892 27.3209 29.1939L42.4271 0H36.8872Z"
            fill="white"
          />
        </svg>

        <h1>VTS Kit Angular</h1>

        <button vts-button vtsType="primary" [routerLink]="['/example']">
          Go to Example
        </button>
      </div>

      <div class="wave-container">
        <svg
          class="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shape-rendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g class="parallax">
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(255,255,255,0.7"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(255,255,255,0.5)"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(255,255,255,0.3)"
            />
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IntroComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
