import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { LineChartcomponent } from '../d3chart/LineChart.component';
import { BarChartcomponent } from '../d3chart/barChart.component';
import {  ScaleChartcomponent } from '../d3chart/ScaleChart.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    BsDropdownModule
  ],
  declarations: [ DashboardComponent, LineChartcomponent, BarChartcomponent, ScaleChartcomponent ]
})
export class DashboardModule { }
