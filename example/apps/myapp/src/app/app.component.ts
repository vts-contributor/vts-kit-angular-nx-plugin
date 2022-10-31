import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppAnimations } from '@vts-kit-ng-nx-demo/share/animation';
import { RouteFacade } from '@vts-kit-ng-nx-demo/share/data-access';

@Component({
  selector: 'vts-kit-ng-nx-demo-root',
  templateUrl: './app.component.html',
  animations: [AppAnimations],
})
export class AppComponent {
  title = 'Myapp';
  routeData$ = this.routeFacade.routeData$;

  constructor(private routeFacade: RouteFacade) {}
}
