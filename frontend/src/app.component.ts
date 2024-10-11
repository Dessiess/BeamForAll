import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';   
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbModule, MatNativeDateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'BeamForAll';
  showNavBar: boolean = true;
  
  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Adjust this URL to match your login route path
        this.showNavBar = event.url !== '/login';
      }
    });
  }

  openDialog(): void {
    this.dialog.open(ModalDialogComponent, {
      width: '500px',
    });
  }
}

