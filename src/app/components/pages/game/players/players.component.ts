import Player from 'src/app/interfaces/Player';
import { SocketService } from 'src/app/services/socket.service';

import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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
      const minScore = this.players.reduce((min, player) => {
        return player.score < min ? player.score : min;
      }, this.players[0].score);
      const index = this.players.findIndex(p => p.name === playerName && p.score === minScore);
      if (index !== -1) this.socketService.choosePlayer(playerName);
    }
  }

  changeScore(playerName: string, score: number) {
    const dialogRef = this.dialog.open(DialogScoreComponent, { data: { playerName, score } });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && Number.isInteger(result.score))
        this.socketService.changeScore(result.playerName, result.score);
    });
  }

}
