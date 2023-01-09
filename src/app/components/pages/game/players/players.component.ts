import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Player from 'src/app/interfaces/Player';
import { SocketService } from 'src/app/services/socket.service';
import { DialogScoreComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent {
  constructor(public dialog: MatDialog,
    private socketService: SocketService
  ) { }

  @Input() players: Player[] = [];
  @Input() maxPlayers?: number;
  @Input() gameState!: string;
  @Input() seconds!: number;
  @Input() secondsMax!: number;
  @Input() chooser?: string;
  @Input() role!: 'showman' | 'player';

  choosePlayer(playerName: string) {
    if (this.gameState === 'choose-player-start' && this.role === 'showman') {
      let min = this.players[0].score;
      for (let i = 1; i < this.players.length; i++) {
        if (min > this.players[i].score) {
          min = this.players[i].score;
        }
      }
      for (const player of this.players) {
        if (player.name === playerName && player.score === min) {
          this.socketService.choosePlayer(playerName);
          return;
        }
      }
    }
  }

  changeScore(playerName: string, score: number) {
    const dialogRef = this.dialog.open(DialogScoreComponent, {
      data: { playerName, score },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result !== undefined && Number.isInteger(result.score)) {
        this.socketService.changeScore(result.playerName, result.score);
      }
    });
  }

}
