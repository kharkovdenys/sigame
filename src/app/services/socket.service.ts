import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
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
  private positionSubject: BehaviorSubject<Position> = new BehaviorSubject<Position>({ i: 0, j: 0 });
  public players = this.playersSubject.asObservable();
  public showman = this.showmanSubject.asObservable();
  public maxPlayers = this.maxPlayersSubject.asObservable();
  public gameState = this.gameStateSubject.asObservable();
  public themes = this.themesSubject.asObservable();
  public roundName = this.roundNameSubject.asObservable();
  public chooser = this.chooserSubject.asObservable();
  public questions = this.questionsSubject.asObservable();
  public position = this.positionSubject.asObservable();
  public gameId = '';

  constructor(private socket: Socket, private router: Router) {

    this.socket.on("player-joined", (player: Player) => {
      console.log("player joined", player);
      const players = this.playersSubject.getValue();
      players.push(player);
      this.playersSubject.next(players);
    });

    this.socket.on('showman-joined', (showman: Showman) => {
      console.log("showman joined", showman);
      this.showmanSubject.next(showman);
    })

    this.socket.on("leave-game", (id: string) => {
      console.log("leave-game");
      let players = this.playersSubject.getValue();
      players = players.filter((player) => player.id !== id);
      this.playersSubject.next(players);
      if (this.showmanSubject.getValue().id === id) {
        this.showmanSubject.next({ id: '', name: '⠀' });
      }
    });

    this.socket.on("player-change-ready", (playerId: string) => {
      console.log("got change ready", playerId);
      const players = this.playersSubject.getValue();
      players.forEach((player) => {
        if (player.id === playerId) {
          player.state = player.state === "not-ready" ? "ready" : "not-ready";
        }
      });
      this.playersSubject.next(players);
    });

    this.socket.on("start", (data: any) => {
      this.gameStateSubject.next(data.gameState);
      this.maxPlayersSubject.next(data.maxPlayers);
      this.themesSubject.next(data.themes);
      console.log(data);
    });

    this.socket.on("show-round-themes", (data: any) => {
      this.gameStateSubject.next(data.gameState);
      this.themesSubject.next(data.themes);
      this.roundNameSubject.next(data.roundName);
      console.log(data);
    });

    this.socket.on("choose-questions", (data: any) => {
      this.gameStateSubject.next(data.gameState);
      this.chooserSubject.next(data.chooser);
      console.log(data);
    });

    this.socket.on("choose-player-start", (data: any) => {
      this.gameStateSubject.next(data.gameState);
      this.questionsSubject.next(data.questions);
      console.log(data);
    });

    this.socket.on("questions", (data: any) => {
      this.questionsSubject.next(data.questions);
      console.log(data);
    });

    this.socket.on('question-i-j', (data: any) => {
      this.gameStateSubject.next(data.gameState);
      this.positionSubject.next({ i: data.i, j: data.j });
      setTimeout(() => {
        let newQuestions = this.questionsSubject.getValue();
        newQuestions[data.j].prices[data.i] = '';
        this.questionsSubject.next(newQuestions);
      }, 1000);
      console.log(data);
    });
  }

  getGames(games: Game[]) {
    this.socket.emit("get-game-list", (gameList: Game[]) => games.push(...gameList));
  }

  choosePlayer(playerName: string) {
    if (this.showmanSubject.getValue().id === this.socket.ioSocket.id) {
      this.socket.emit("choose-player", { playerName, gameId: this.gameId });
    }
  }

  sendChooseQuestion(i: number, j: number) {
    this.socket.emit("choose-question", { i, j, gameId: this.gameId });
  }

  upload(file: File) {
    this.socket.emit("upload-pack", file, (status: any) => {
      console.log(status);
    });
  }

  getId(): string {
    return this.socket.ioSocket.id;
  }

  changeReady() {
    this.socket.emit("change-ready", { gameId: this.gameId }, (status: any) => {
      console.log(status);
    });
  }

  start() {
    this.socket.emit("start", { gameId: this.gameId }, (status: any) => {
      console.log(status);
    });
  }

  leave() {
    this.socket.emit("leave-room", this.gameId);
  }

  join(gameId: string, type: 'player' | 'showman') {
    this.socket.emit("join-game", { gameId, name: localStorage.getItem('name'), type }, (data: any) => {
      if (data.status === 'success') {
        this.playersSubject.next(data.players);
        this.showmanSubject.next(data.showman);
        this.maxPlayersSubject.next(data.maxPlayers);
        this.gameStateSubject.next(data.gameState);
        this.gameId = data.gameId;
        this.router.navigate(['/game']);
      }
      else {
        console.log(data);
      }
    });
  }

  create(name: string, maxPlayers: number) {
    this.socket.emit("create-game", { name, maxPlayers, showmanName: localStorage.getItem('name') }, (data: any) => {
      if (data.status === 'success') {
        this.playersSubject.next([]);
        this.showmanSubject.next(data.showman);
        this.maxPlayersSubject.next(data.maxPlayers);
        this.gameStateSubject.next(data.gameState);
        this.gameId = data.gameId;
        this.router.navigate(['/game']);
      }
      else {
        console.log(data);
      }
    });
  }
}
