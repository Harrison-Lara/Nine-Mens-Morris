import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { GameOverData } from "../model/gameOverData.model";

@Component({
  selector: 'app-gameOver',
  templateUrl: './gameOver.component.html',
  styleUrls: ['./gameOver.component.css']
})

export class GameOverComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GameOverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GameOverData) {
  }

  ngOnInit() {
  }

}
