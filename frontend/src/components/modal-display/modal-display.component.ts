import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportService } from '../../services/reports.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  selector: 'app-modal-display',
  styleUrls: ['./modal-display.component.scss'],
  templateUrl: './modal-display.component.html',
})
export class ModalDisplayComponent implements OnInit {
  report: any;
  option1Timestamp: string | null = null; // Store timestamp for Option 1
  option2Timestamp: string | null = null; // Store timestamp for Option 2

  constructor(
    private _reportService: ReportService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<ModalDisplayComponent>,
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.report = this.data?.meta;
  }

  onClose(): void {
    this._dialogRef.close(this.report);
  }

  onOption1Change(event: MatCheckboxChange): void {
    if (event.checked) {
      this.option1Timestamp = new Date().toLocaleString(); // Save the current time
      console.log('Option 1 checked at:', this.option1Timestamp);
      // You can also save this to your report if needed
      this.report.option1Time = this.option1Timestamp; 
    } else {
      this.option1Timestamp = null; // Reset if unchecked
    }
  }

  onOption2Change(event: MatCheckboxChange): void {
    if (event.checked) {
      this.option2Timestamp = new Date().toLocaleString(); // Save the current time
      console.log('Option 2 checked at:', this.option2Timestamp);
      // Save to report if needed
      this.report.option2Time = this.option2Timestamp; 
    } else {
      this.option2Timestamp = null; // Reset if unchecked
    }
  }
}


