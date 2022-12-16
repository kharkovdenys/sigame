import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import Player from 'src/app/interfaces/Player';
import Position from 'src/app/interfaces/Position';
import Question from 'src/app/interfaces/Question';
import Showman from 'src/app/interfaces/Showman';
import Theme from 'src/app/interfaces/Theme';
import { SocketService } from 'src/app/services/socket.service';
import { DialogRates } from './ratesdialog/ratesdialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnDestroy {
  showman?: Showman;
  gameId?: string;
  maxPlayers?: number;
  role: 'showman' | 'player';
  gameState = "waiting-ready";
  roundName?: string;
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
  chooser?: string;
  chooserSub?: Subscription;
  questions: Question[] = [];
  questionsSub?: Subscription;
  position: Position = { i: 0, j: 0 };
  positionSub?: Subscription;
  typeRound?: 'final' | 'default';
  typeRoundSub?: Subscription;
  comment = 'Waiting for the start';

  constructor(
    private router: Router,
    private socketService: SocketService,
    public dialog: MatDialog
  ) {
    this.playersSub = this.socketService.players.subscribe(players => this.players = players);
    this.questionsSub = this.socketService.questions.subscribe(questions => this.questions = questions);
    this.showmanSub = this.socketService.showman.subscribe(showman => this.showman = showman);
    this.maxPlayersSub = this.socketService.maxPlayers.subscribe(maxPlayers => this.maxPlayers = maxPlayers);
    this.chooserSub = this.socketService.chooser.subscribe(chooser => this.chooser = chooser);
    this.gameStateSub = this.socketService.gameState.subscribe(gameState => {
      this.gameState = gameState;
      switch (gameState) {
        case 'waiting-ready': { this.comment = 'Waiting for the start'; break; }
        case 'show-themes': { this.comment = this.socketService.packInfo ?? ''; break; }
        case 'show-round-themes': { this.comment = this.typeRound === 'default' ? 'Themes of the round' : 'The final. Participants who do not have a positive score are knocked out'; break; }
        case 'choose-player-start': { this.comment = 'The showman chooses who starts the game'; break; }
        case 'choose-questions': { this.comment = this.chooser + ' chooses a question'; break; }
        case 'choose-theme': { this.comment = this.chooser + "chooses a theme he doesn't want"; break; }
        case 'question-i-j': { this.comment = 'The question will be ' + this.questions[this.position.j].name + ' ' + this.questions[this.position.j].prices[this.position.i]; break; }
        case 'theme-i': { this.comment = 'The theme will not be ' + this.themes[this.position.i].name; break; }
        case 'rates': { this.comment = 'Players who made it to the finals place bets'; break; }
      }
      this.intervalSub?.unsubscribe();
      if (gameState === 'choose-player-start' || gameState === 'choose-questions' || gameState === 'choose-theme' || gameState === 'rates') {
        this.seconds = this.secondsMax;
        this.intervalSub = this.interval.subscribe(() => this.seconds > 0 ? this.seconds -= 1 : this.intervalSub?.unsubscribe());
      }
      this.role !== 'showman' ? this.dialog.closeAll() : undefined;
      if (gameState === 'rates' && this.role === 'player' && this.players.filter(p => p.id === this.socketService.getId())[0].state !== 'Not a finalist') {
        this.openDialog();
      }
    });
    this.positionSub = this.socketService.position.subscribe(position => this.position = position);
    this.themesSub = this.socketService.themes.subscribe(themes => this.themes = themes);
    this.roundNameSub = this.socketService.roundName.subscribe(roundName => this.roundName = roundName);
    this.typeRoundSub = this.socketService.typeRound.subscribe(typeRound => this.typeRound = typeRound);
    this.gameId = this.socketService.gameId;
    this.role = this.socketService.getId() === this.showman?.id ? 'showman' : 'player';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogRates, {
      disableClose: true,
      data: { score: 1, maxScore: this.players.filter(p => p.id === this.socketService.getId())[0].score },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result !== undefined && result > 0) {
        this.socketService.sendRate(result);
      }
    });
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
    this.typeRoundSub?.unsubscribe();
  }

}

