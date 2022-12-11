import { Component, Input } from '@angular/core';
import Player from 'src/app/interfaces/Player';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent {

  constructor(
    private socketService: SocketService
  ) { }

  @Input() players!: Player[];
  @Input() maxPlayers!: number;
  @Input() gameState!: string;
  @Input() seconds!: number;
  @Input() secondsMax!: number;
  @Input() chooser!: string;

  typeOf(value: any) {
    return typeof value;
  }

  choosePlayer(playerName: string) {
    if (this.gameState === 'choose-player-start') {
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

}
