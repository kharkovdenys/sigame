import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DialogNameComponent } from './dialog/dialog-name.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  name = localStorage.getItem('name') ?? '';

  constructor(public dialog: MatDialog, private router: Router) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogNameComponent, { data: { name: this.name } });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      localStorage.setItem('name', result);
      this.name = result;
      this.router.navigate(['/newgame']);
    });
  }
}