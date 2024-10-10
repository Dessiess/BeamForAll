import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '*', redirectTo: '/', pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  { path: 'login', component: LoginComponent },
];

