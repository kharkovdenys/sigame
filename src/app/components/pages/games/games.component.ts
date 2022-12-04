import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Game from 'src/app/interfaces/Game';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  constructor(
    private socketService: SocketService, private router: Router
  ) { }
  games: Game[] = [];

  ngOnInit(): void {
    this.socketService.getGames(this.games);
  }
  join(gameid: string) {
    this.socketService.join(gameid, this.router);
  }
}
