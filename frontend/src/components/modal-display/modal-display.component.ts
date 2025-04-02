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
    templateUrl: './modal-display.component.html'
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

  onClose(deleted = false): void {
    this._dialogRef.close({ deleted });
  }

  isSaving = false;

  onSave(): void {
    this.isSaving = true;
    this._reportService.update(this.report, this.report.id).subscribe(
      (response) => {
        this.isSaving = false;
        this._dialogRef.close();
  
        // refresh on save
        this._reportService.refreshView.next();
      },
      (error) => {
        this.isSaving = false;
        this.showErrorMessage('Failed to save the report.');
      }
    );
  }

  onDelete(): void {
    if (this.report?.id) {
      this._reportService.delete(this.report.id).subscribe(
        () => {
          console.log('Report deleted successfully.');
          this._dialogRef.close({ deleted: true });
  
          // refresh on delete 
          this._reportService.refreshView.next();
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

  showErrorMessage(_arg0: string) {
    throw new Error('Method not implemented.');
  }

  readyTimeChange(event: MatCheckboxChange): void {
    const newValue = event.checked ? new Date().toISOString() : "";
    if (this.report.ready_time !== newValue) {
      this.report.ready_time = newValue;
      this._reportService.update(this.report, this.report.id);
    }
  }
  
  departureTimeChange(event: MatCheckboxChange): void {
    const newValue = event.checked ? new Date().toISOString() : "";
    if (this.report.departure_time !== newValue) {
      this.report.departure_time = newValue;
      this._reportService.update(this.report, this.report.id);
    }
  }
}


