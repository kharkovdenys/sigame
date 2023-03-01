import { Subscription } from 'rxjs';
import Game from 'src/app/interfaces/Game';
import { SocketService } from 'src/app/services/socket.service';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DialogJoinComponent } from '../../dialogs/joindialog/joindialog.component';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit, OnDestroy {
  name = localStorage.getItem('name') ?? '';
  games: Game[] = [];
  deletedGameSubscription!: Subscription;
  newGameSubscription!: Subscription;

  constructor(private dialog: MatDialog,
    private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.getGames(this.games);
    this.deletedGameSubscription = this.socketService.onDeletedGame().subscribe((gameId) => this.games = this.games.filter(g => g.id !== gameId));
    this.newGameSubscription = this.socketService.onNewGame().subscribe((game) => this.games.push(game as Game));
  }

  openDialog(gameId: string): void {
    const dialogRef = this.dialog.open(DialogJoinComponent, { data: { name: this.name } });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      localStorage.setItem('name', result.name);
      this.name = result.name;
      this.socketService.join(gameId, result.type);
    });
  }

  ngOnDestroy(): void {
    this.newGameSubscription?.unsubscribe();
    this.deletedGameSubscription?.unsubscribe();
  }
}
