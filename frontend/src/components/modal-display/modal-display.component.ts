import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportService } from '../../services/reports.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    this._dialogRef.close();
  }
}
