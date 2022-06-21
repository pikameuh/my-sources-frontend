import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/user/users/users.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { UpdateUserProfileComponent } from './components/user/update-user-profile/update-user-profile.component';
import { CreateBlogEntryComponent } from './components/blog-entry/create-blog-entry/create-blog-entry.component';
import { ViewBlogEntryComponent } from './components/blog-entry/view-blog-entry/view-blog-entry.component';
import { RoleGuardService } from './guards/role.guard';
import { UsersProfileComponent } from './components/user/all-users-profile/users-profile.component';


const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuardService],
    // canActivate: [RoleGuardService],
    data: { expectedRole: ['admin', 'astek'], animation: 'admin' },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'login',
    data: { animation: 'login' },
    component: LoginComponent
  },
  {
    path: 'register',
    data: { animation: 'register' },
    component: RegisterComponent
  },
  {
    path: 'users',
    canActivate: [AuthGuard, RoleGuardService],
    data: { expectedRole: ['admin', 'astek', 'lord'], animation: 'users' },
    children: [
      {
        path: '',
        component: UsersComponent
      },
      {
        path: ':id',
        component: UsersProfileComponent,
      },
    ]
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    data: { animation: 'user' },
    children: [
      {
        path: '',
        component: UserProfileComponent
      },
      // {
      //   path: ':id',
      //   component: UserProfileComponent
      // },
    ],
  },
  
  {
    path: 'update-profile',
    component: UpdateUserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'blog-entries/:id',
    component: ViewBlogEntryComponent
  },
  {
    path: 'home',
    data: { animation: 'home' },
    component: HomeComponent
  },
  {
    path: 'create-blog-entry',
    component: CreateBlogEntryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
