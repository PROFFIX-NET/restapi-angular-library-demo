import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from 'app/login/login.component';
import { RapportComponent } from 'app/rapport/rapport.component';
import { ProfilComponent } from 'app/profil/profil.component';
import { AuthGuard } from 'app/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: "rapport", component: RapportComponent, canActivate: [AuthGuard] },
  { path: "profil", component: ProfilComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "/rapport" }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
