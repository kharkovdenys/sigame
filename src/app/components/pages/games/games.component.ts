import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Game from 'src/app/interfaces/Game';
import { SocketService } from 'src/app/services/socket.service';
import { DialogJoinComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  name: string;

  constructor(public dialog: MatDialog,
    private socketService: SocketService) {
    this.name = localStorage.getItem('name') ?? '';
  }
  games: Game[] = [];

  ngOnInit(): void {
    this.socketService.getGames(this.games);
  }

  openDialog(gameId: string): void {
    const dialogRef = this.dialog.open(DialogJoinComponent, {
      data: { name: this.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result !== undefined && result.name !== '') {
        localStorage.setItem('name', result.name);
        this.name = result.name;
        this.socketService.join(gameId, result.type);
      }
    });
  }
}
