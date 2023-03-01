import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import Atom from '../interfaces/Atom';
import Game from '../interfaces/Game';
import Player from '../interfaces/Player';
import Position from '../interfaces/Position';
import Question from '../interfaces/Question';
import Showman from '../interfaces/Showman';
import Theme from '../interfaces/Theme';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private playersSubject: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
  private showmanSubject: BehaviorSubject<Showman> = new BehaviorSubject<Showman>({ id: '', name: '⠀' });
  private maxPlayersSubject: BehaviorSubject<number> = new BehaviorSubject<number>(5);
  private gameStateSubject: BehaviorSubject<string> = new BehaviorSubject<string>('waiting-ready');
  private themesSubject: BehaviorSubject<Theme[]> = new BehaviorSubject<Theme[]>([]);
  private roundNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private chooserSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private questionsSubject: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  private positionSubject: BehaviorSubject<Position> = new BehaviorSubject<Position>({ i: -1, j: -1 });
  private typeRoundSubject: BehaviorSubject<'final' | 'default'> = new BehaviorSubject<'final' | 'default'>('default');
  private atomSubject: BehaviorSubject<Atom> = new BehaviorSubject<Atom>({ type: 'default' });
  private pauseSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private role: 'showman' | 'player' = 'showman';
  public players = this.playersSubject.asObservable();
  public showman = this.showmanSubject.asObservable();
  public maxPlayers = this.maxPlayersSubject.asObservable();
  public gameState = this.gameStateSubject.asObservable();
  public themes = this.themesSubject.asObservable();
  public roundName = this.roundNameSubject.asObservable();
  public chooser = this.chooserSubject.asObservable();
  public questions = this.questionsSubject.asObservable();
  public position = this.positionSubject.asObservable();
  public typeRound = this.typeRoundSubject.asObservable();
  public atom = this.atomSubject.asObservable();
  public gamePause = this.pauseSubject.asObservable();
  public gameId?: string;
  public packInfo?: string;
  public comment = '';
  public timing = 15;
  public answer = '';
  public playerAnswer = '';

  constructor(private socket: Socket, private router: Router, private snackBar: MatSnackBar) {

    this.socket.on("connect", () => {
      console.log("connected to the server");
      if (this.gameId)
        this.join(this.gameId, this.role);
    });

    this.socket.on("player-joined", (data: { players: Player[], chooser: string }) => {
      this.playersSubject.next(data.players);
      this.chooserSubject.next(data.chooser);
    });

    this.socket.on('showman-joined', (showman: Showman) => {
      this.showmanSubject.next(showman);
    })

    this.socket.on("leave-game", (id: string) => {
      const players = this.playersSubject.getValue();
      const index = players.findIndex(p => p.id === id);
      if (index === -1) {
        if (this.showmanSubject.getValue().id === id) {
          this.showmanSubject.next({ id: '', name: '⠀' });
        }
      }
      else {
        if (this.gameStateSubject.getValue() !== "waiting-ready")
          players[index].id = undefined;
        else
          players.splice(index, 1);
        this.playersSubject.next(players);
      }
    });

    this.socket.on("player-change-ready", (playerId: string) => {
      const players = this.playersSubject.getValue();
      players.some((p) => {
        if (p.id === playerId) {
          p.state = p.state === "Not ready" ? "Ready" : "Not ready";
          return true;
        }
        return false;
      });
      this.playersSubject.next(players);
    });

    this.socket.on("player-change-score", (data: { players: Player[], score: number, playerName: string }) => {
      const players = this.playersSubject.getValue();
      players.some((p) => {
        if (p.name === data.playerName) {
          p.score = data.score;
          return true;
        }
        return false;
      });
      this.playersSubject.next(players);
    });

    this.socket.on("start", (data: { gameState: string, maxPlayers: number, themes: Theme[] }) => {
      this.gameStateSubject.next(data.gameState);
      this.maxPlayersSubject.next(data.maxPlayers);
      this.themesSubject.next(data.themes);
    });

    this.socket.on("pause", (pause: boolean) => {
      this.pauseSubject.next(pause);
    });

    this.socket.on("show-question", (data: { atom: Atom, gameState: string }) => {
      this.atomSubject.next(data.atom);
      this.gameStateSubject.next(data.gameState);
    });

    this.socket.on("answer", (data: { atom: Atom, comment: string, gameState: string }) => {
      this.comment = data.comment;
      this.atomSubject.next(data.atom);
      this.gameStateSubject.next(data.gameState);
    });

    this.socket.on("show-round-themes", (data: { typeRound: 'final' | 'default', gameState: string, themes: Theme[], roundName: string }) => {
      this.typeRoundSubject.next(data.typeRound);
      this.gameStateSubject.next(data.gameState);
      this.themesSubject.next(data.themes);
      this.roundNameSubject.next(data.roundName);
    });

    this.socket.on("choose-questions", (data: { chooser: string, gameState: string }) => {
      this.chooserSubject.next(data.chooser);
      this.gameStateSubject.next(data.gameState);
    });

    this.socket.on("rates", (data: { gameState: string }) => {
      this.gameStateSubject.next(data.gameState);
    });

    this.socket.on("can-answer", (data: { timing: number, gameState: string }) => {
      this.timing = data.timing;
      this.gameStateSubject.next(data.gameState);
    });

    this.socket.on("answering", (data: { chooser: string, gameState: string }) => {
      this.chooserSubject.next(data.chooser);
      this.gameStateSubject.next(data.gameState);
    });

    this.socket.on("correct-answer", (answer: string) => {
      this.answer = answer;
    });

    this.socket.on("choose-theme", (data: { chooser: string, gameState: string }) => {
      this.chooserSubject.next(data.chooser);
      this.gameStateSubject.next(data.gameState);
    });

    this.socket.on("choose-player-start", (data: { gameState: string, questions: Question[] }) => {
      this.gameStateSubject.next(data.gameState);
      this.questionsSubject.next(data.questions);
    });

    this.socket.on("questions", (data: { questions: Question[] }) => {
      this.questionsSubject.next(data.questions);
    });

    this.socket.on("without-finale", () => {
      this.gameStateSubject.next('without-finale');
    });

    this.socket.on("final", () => {
      this.gameStateSubject.next('final');
    });

    this.socket.on("final-answer", (data: { answer: string, chooser: string, gameState: string }) => {
      this.playerAnswer = data.answer;
      this.chooserSubject.next(data.chooser);
      this.gameStateSubject.next(data.gameState);
    });

    this.socket.on("answering-final", () => {
      this.gameStateSubject.next('answering-final');
    });

    this.socket.on("questions-final", (data: { questions: Question[], players: Player[] }) => {
      this.questionsSubject.next(data.questions);
      this.playersSubject.next(data.players);
    });

    this.socket.on('question-i-j', (data: { i: number, j: number, gameState: string }) => {
      this.positionSubject.next({ i: data.i, j: data.j });
      this.gameStateSubject.next(data.gameState);
      setTimeout(() => {
        const newQuestions = this.questionsSubject.getValue();
        newQuestions[data.j].prices[data.i] = '';
        this.questionsSubject.next(newQuestions);
      }, 1000);
    });

    this.socket.on('theme-i', (data: { i: number, gameState: string }) => {
      this.positionSubject.next({ i: data.i, j: -1 });
      this.gameStateSubject.next(data.gameState);
      setTimeout(() => {
        const newQuestions = this.questionsSubject.getValue();
        newQuestions[data.i].name = '⠀';
        this.questionsSubject.next(newQuestions);
      }, 1000);
    });
  }

  onNewGame() {
    return this.socket.fromEvent('new-game');
  }

  onDeletedGame() {
    return this.socket.fromEvent('deleted-game');
  }

  getGames(games: Game[]) {
    this.socket.emit("get-game-list", (gameList: Game[]) => games.push(...gameList));
  }

  choosePlayer(playerName: string) {
    if (this.role === 'showman')
      this.socket.emit("choose-player", { playerName, gameId: this.gameId });
  }

  sendChooseQuestion(i: number, j: number) {
    this.socket.emit("choose-question", { i, j, gameId: this.gameId });
  }

  sendChooseTheme(i: number) {
    this.socket.emit("choose-theme", { i, gameId: this.gameId });
  }

  sendRate(score: number) {
    this.socket.emit("send-rate", { score, gameId: this.gameId });
  }

  sendAnswer(answer: string) {
    this.socket.emit("send-answer", { answer, gameId: this.gameId });
  }

  clickForAnswer() {
    this.socket.emit("click-for-answer", { gameId: this.gameId });
  }

  sendAnswerResult(result: boolean) {
    this.socket.emit("send-answer-result", { gameId: this.gameId, result, chooser: this.chooserSubject.getValue() });
  }

  sendFinalAnswerResult(result: boolean) {
    this.socket.emit("send-final-answer-result", { gameId: this.gameId, result, chooser: this.chooserSubject.getValue() });
  }

  getId(): string {
    return this.socket.ioSocket.id;
  }

  changeReady() {
    this.socket.emit("change-ready", { gameId: this.gameId }, (data: { status: string, message: string }) => {
      if (data.status !== 'success')
        this.snackBar.open(data.message, 'Close', { duration: 3000 });
    });
  }

  changeScore(playerName: string, score: number) {
    this.socket.emit("change-score", { gameId: this.gameId, playerName, score }, (data: { status: string, message: string }) => {
      if (data.status !== 'success')
        this.snackBar.open(data.message, 'Close', { duration: 3000 });
    });
  }

  start() {
    this.socket.emit("start", { gameId: this.gameId }, (data: { status: string, message: string }) => {
      if (data.status !== 'success')
        this.snackBar.open(data.message, 'Close', { duration: 3000 });
    });
  }

  skip() {
    this.socket.emit("skip", { gameId: this.gameId }, (data: { status: string, message: string }) => {
      if (data.status !== 'success')
        this.snackBar.open(data.message, 'Close', { duration: 3000 });
    });
  }

  pause() {
    this.socket.emit("pause", { gameId: this.gameId }, (data: { status: string, message: string }) => {
      if (data.status !== 'success')
        this.snackBar.open(data.message, 'Close', { duration: 3000 });
    });
  }

  leave() {
    this.socket.emit("leave-room", this.gameId);
    this.gameId = undefined;
  }

  join(gameId: string, type: 'player' | 'showman') {
    this.socket.emit("join-game", { gameId, name: localStorage.getItem('name'), type }, (data: { showman: Showman, status: string, maxPlayers: number, gameState: string, gameId: string, packInfo: string, players: Player[], themes: Theme[], roundName: string, chooser: string, questions: Question[], typeRound: 'final' | 'default', pause: boolean, message: string }) => {
      if (data.status === 'success') {
        this.playersSubject.next(data.players);
        this.showmanSubject.next(data.showman);
        this.maxPlayersSubject.next(data.maxPlayers);
        this.themesSubject.next(data.themes);
        this.roundNameSubject.next(data.roundName);
        this.chooserSubject.next(data.chooser);
        this.questionsSubject.next(data.questions);
        this.typeRoundSubject.next(data.typeRound);
        this.gameStateSubject.next(data.gameState);
        this.pauseSubject.next(data.pause);
        this.role = type;
        this.gameId = data.gameId;
        this.packInfo = data.packInfo;
        this.router.navigate(['/game']);
      }
      else this.snackBar.open(data.message, 'Close', { duration: 3000 });
    });
  }

  create(name: string, maxPlayers: number) {
    this.socket.emit("create-game", { name, maxPlayers, showmanName: localStorage.getItem('name') }, (data: { showman: Showman, status: string, maxPlayers: number, gameState: string, gameId: string, packInfo: string, message: string }) => {
      if (data.status === 'success') {
        this.playersSubject.next([]);
        this.showmanSubject.next(data.showman);
        this.maxPlayersSubject.next(data.maxPlayers);
        this.gameStateSubject.next(data.gameState);
        this.role = 'showman';
        this.gameId = data.gameId;
        this.packInfo = data.packInfo;
        this.router.navigate(['/game']);
      }
      else this.snackBar.open(data.message, 'Close', { duration: 3000 });
    });
  }
}
