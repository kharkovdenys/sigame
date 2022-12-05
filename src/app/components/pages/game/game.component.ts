import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Player from 'src/app/interfaces/Player';
import Showman from 'src/app/interfaces/Showman';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnDestroy {
  showman: Showman = { id: '', name: '⠀' };
  gameId: string;
  maxPlayers: number = 5;
  role: 'showman' | 'player';
  gameState = "waiting-ready";
  players: Player[] = [];
  playersSub?: Subscription;
  showmanSub?: Subscription;
  maxPlayersSub?: Subscription;
  gameStateSub?: Subscription;
  typeof: any;

  constructor(
    private router: Router,
    private socketService: SocketService
  ) {
    this.playersSub = this.socketService.players.subscribe(players => this.players = players);
    this.showmanSub = this.socketService.showman.subscribe(showman => this.showman = showman);
    this.maxPlayersSub = this.socketService.maxPlayers.subscribe(maxPlayers => this.maxPlayers = maxPlayers);
    this.gameStateSub = this.socketService.gameState.subscribe(gameState => this.gameState = gameState);
    this.gameId = this.socketService.gameId;
    this.role = this.socketService.getId() === this.showman.id ? 'showman' : 'player';
  }

  start() {
    this.socketService.start();
  }

  leave() {
    this.socketService.leave();
    this.router.navigate(['']);
  }

  changeReady() {
    this.socketService.changeReady();
  }

  ngOnDestroy(): void {
    this.socketService.leave();
    this.playersSub?.unsubscribe();
    this.showmanSub?.unsubscribe();
    this.maxPlayersSub?.unsubscribe();
    this.gameStateSub?.unsubscribe();
  }

}

