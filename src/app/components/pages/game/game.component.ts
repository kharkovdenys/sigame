import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Player from 'src/app/interfaces/Player';
import Showman from 'src/app/interfaces/Showman';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  showman: Showman;
  gameId: string;
  maxPlayers: number;
  states: any;
  role: 'showman' | 'player';
  gameState = "waiting-ready";
  players: Player[] = [];

  constructor(
    private router: Router,
    private socketService: SocketService
  ) {
    this.socketService.players.subscribe(players => this.players = players);
    this.states = this.router.getCurrentNavigation()?.extras.state;
    if (typeof this.states === 'undefined') {
      this.showman = { id: "d", name: "chaha" };
      this.gameId = 'd';
      this.maxPlayers = 5;
    }
    else {
      this.showman = this.states.showman ?? { id: "d", name: "chaha" };
      this.gameId = this.states.gameId ?? 'd';
      this.maxPlayers = this.states.maxPlayers ?? 5;
    }
    this.role = this.socketService.getId() === this.showman.id ? 'showman' : 'player';
  }

  start() {
    this.socketService.start(this.gameId);
  }

  leave() {
    this.socketService.leave(this.gameId);
    this.router.navigate([''], { replaceUrl: true });
  }

  changeReady() {
    this.socketService.changeReady(this.gameId);
  }

  getPlayers(): Player[] {
    return this.players;
  }


}

