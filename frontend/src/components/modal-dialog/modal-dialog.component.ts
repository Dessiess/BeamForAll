import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReportService } from '../../services/reports.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Optional
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Optional for locale
  ],
  selector: 'app-modal-dialog',
  styleUrls: ['./modal-dialog.component.scss'],
  templateUrl: './modal-dialog.component.html',
})
export class ModalDialogComponent implements OnInit {
  materialForm!: FormGroup;

  constructor(
    public _dialogRef: MatDialogRef<ModalDialogComponent>,
    private _formBuilder: FormBuilder,
    private _reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.materialForm = this._formBuilder.group({
      company_name: ['3223', Validators.required],
      rn: ['132', Validators.required],
      material_type: ['33', Validators.required],
      package_number: ['33', Validators.required],
      comment: ['33'],
      date: ['2024-11-28', Validators.required],
      start_time: ['13:36:24', Validators.required],
      end_time: ['14:32:22', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.materialForm.valid) {
      this._reportService.addReport.next({...this.materialForm.value, ready_time: '', departure_time: ''});
      this._dialogRef.close()
    }
  }

  onClose(): void {
    this._dialogRef.close();
  }
}
