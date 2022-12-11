import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogName } from './dialog/dialog-name.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  name: string;

  constructor(public dialog: MatDialog, private router: Router) {
    this.name = localStorage.getItem('name') ?? '';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogName, {
      data: { name: this.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result !== undefined && result !== '') {
        localStorage.setItem('name', result);
        this.name = result;
        this.router.navigate(['/newgame']);
      }
    });
  }
}