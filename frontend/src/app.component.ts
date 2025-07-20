import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';   
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';

import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NgbModule, MatNativeDateModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BeamForAll';
  showNavBar: boolean = true;
  
  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavBar =!['/login', '/register'].includes(event.url) ;
      }
    });
  }

  openDialog(): void {
    this.dialog.open(ModalDialogComponent, {
      width: '500px',
    });
  }
}

