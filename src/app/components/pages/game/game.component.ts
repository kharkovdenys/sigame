import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import Player from 'src/app/interfaces/Player';
import Position from 'src/app/interfaces/Position';
import Question from 'src/app/interfaces/Question';
import Showman from 'src/app/interfaces/Showman';
import Theme from 'src/app/interfaces/Theme';
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
  roundName = '';
  players: Player[] = [];
  themes: Theme[] = [];
  playersSub?: Subscription;
  showmanSub?: Subscription;
  maxPlayersSub?: Subscription;
  gameStateSub?: Subscription;
  themesSub?: Subscription;
  roundNameSub?: Subscription;
  secondsMax = 30;
  seconds = 0;
  interval = interval(1000);
  intervalSub?: Subscription;
  chooser = '';
  chooserSub?: Subscription;
  questions: Question[] = [];
  questionsSub?: Subscription;
  position: Position = { i: 0, j: 0 };
  positionSub?: Subscription;

  constructor(
    private router: Router,
    private socketService: SocketService
  ) {
    this.playersSub = this.socketService.players.subscribe(players => this.players = players);
    this.questionsSub = this.socketService.questions.subscribe(questions => this.questions = questions);
    this.showmanSub = this.socketService.showman.subscribe(showman => this.showman = showman);
    this.maxPlayersSub = this.socketService.maxPlayers.subscribe(maxPlayers => this.maxPlayers = maxPlayers);
    this.chooserSub = this.socketService.chooser.subscribe(chooser => this.chooser = chooser);
    this.gameStateSub = this.socketService.gameState.subscribe(gameState => {
      this.gameState = gameState;
      this.intervalSub?.unsubscribe();
      if (gameState === 'choose-player-start' || gameState === 'choose-questions') {
        this.seconds = this.secondsMax;
        this.intervalSub = this.interval.subscribe(() => this.seconds > 0 ? this.seconds -= 1 : this.intervalSub?.unsubscribe());
      }
    });
    this.positionSub = this.socketService.position.subscribe(position => this.position = position);
    this.themesSub = this.socketService.themes.subscribe(themes => this.themes = themes);
    this.roundNameSub = this.socketService.roundName.subscribe(roundName => this.roundName = roundName);
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

  getPlayerName(): string | undefined {
    const id = this.socketService.getId();
    const player = this.players.filter(p => p.id === id);
    if (player.length)
      return player[0].name;
    else
      return undefined;
  }

  ngOnDestroy(): void {
    this.socketService.leave();
    this.playersSub?.unsubscribe();
    this.showmanSub?.unsubscribe();
    this.maxPlayersSub?.unsubscribe();
    this.gameStateSub?.unsubscribe();
    this.themesSub?.unsubscribe();
    this.roundNameSub?.unsubscribe();
    this.intervalSub?.unsubscribe();
    this.questionsSub?.unsubscribe();
    this.positionSub?.unsubscribe();
  }

}

