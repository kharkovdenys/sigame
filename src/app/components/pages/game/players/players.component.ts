import { Component, Input } from '@angular/core';
import Player from 'src/app/interfaces/Player';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent {
  @Input() players!: Player[];
  @Input() maxPlayers!: number;
  @Input() gameState!: string;
}
