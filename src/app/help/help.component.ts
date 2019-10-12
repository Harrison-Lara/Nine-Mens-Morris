import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: 'help-component',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {

  constructor(
    public dialogRef: MatDialogRef<HelpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

}
