import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      // {
      //   path: 'components',
      //   loadChildren: './views/components/components.module#ComponentsModule'
      // },
      
    ]
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'SnapShots'
    },
    children: [
      {
        path: 'SnapShots',
        loadChildren: './views/SnapShots/SnapShots.module#SnapShotsModule',
      },
      {
        path: 'report',
        loadChildren: './views/report/report.module#ReportModule',
      }
    ]
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'userpref'
    },
    children: [
      {
        path: 'userpref',
        loadChildren: './views/userpref/userpref.module#UserPrefModule',
      }
    ]
  }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
