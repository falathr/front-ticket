import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TicketsComponent } from './components/tickets/tickets.component';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { GetTicketComponent } from './components/get-ticket/get-ticket.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { PostTicketComponent } from './components/post-ticket/post-ticket.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { PutTicketComponent } from './components/put-ticket/put-ticket.component';
import { DeleteTicketComponent } from './components/delete-ticket/delete-ticket.component';
import { DatePipe } from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import { GetGestionComponent } from './components/gestion-tickets/get-gestion/get-gestion.component';
import { PostGestionComponent } from './components/gestion-tickets/post-gestion/post-gestion.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './components/interfaces/custom-mat-paginator-intl';
import {MatStepperModule} from '@angular/material/stepper';
import { PutGestionComponent } from './components/gestion-tickets/put-gestion/put-gestion.component';

@NgModule({
  declarations: [
    AppComponent,
    TicketsComponent,
    GetTicketComponent,
    PostTicketComponent,
    PutTicketComponent,
    DeleteTicketComponent,
    GetGestionComponent,
    PostGestionComponent,
    PutGestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatStepperModule

  ],
  providers: [DatePipe, { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
