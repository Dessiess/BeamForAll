import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportService } from '../../services/reports.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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
isLoading: unknown;
  constructor(
    private _reportService: ReportService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<ModalDisplayComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {
    const openReport = this.data?.meta;
    this.report = {
      ...openReport,
      ready_time: openReport?.ready_time || "",
      departure_time: openReport?.departure_time || ""
    };
  }

  onClose(): void {
    this._dialogRef.close();
  }

  onSave(): void {
    console.log('Report to save:', this.report); // Log the current report data
    this._reportService.update(this.report); // Save the report
    this._dialogRef.close();
  }

  onDelete(): void {
    if (this.report?.id) {
      this._reportService.delete(this.report.id).subscribe(
        () => {
          console.log('Report deleted successfully.');
          this._dialogRef.close({ deleted: true });
          this.router.navigate([this.router.url]);
        },
        (error: any) => {
          console.error('Error deleting report:', error);
          // Optionally, show an error message to the user
          this.showErrorMessage('Failed to delete the report. Please try again later.');
          this._dialogRef.close(); // Close dialog after error
        }
      );
    } else {
      console.error('No report ID found for deletion.');
      this.showErrorMessage('No report ID found. Unable to delete.');
      this._dialogRef.close(); // Close dialog if no ID is found
    }
  }

  showErrorMessage(arg0: string) {
    throw new Error('Method not implemented.');
  }

  readyTimeChange(event: MatCheckboxChange): void {
    this.report.ready_time = !event.checked ? "" : new Date().toISOString();
    this._reportService.update(this.report);
  }

  departureTimeChange(event: MatCheckboxChange): void {
    this.report.departure_time = !event.checked ? "" : new Date().toISOString();
    this._reportService.update(this.report);
  }
}


