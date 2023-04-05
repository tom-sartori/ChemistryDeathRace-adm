import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { MaterialModule } from "./material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    DatePipe
  ]

})
export class SharedModule { }
