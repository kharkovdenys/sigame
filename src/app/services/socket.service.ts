import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import Game from '../interfaces/Game';
import Player from '../interfaces/Player';
import Showman from '../interfaces/Showman';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private playersSubject: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
  private showmanSubject: BehaviorSubject<Showman> = new BehaviorSubject<Showman>({ id: '', name: '⠀' });
  private maxPlayersSubject: BehaviorSubject<number> = new BehaviorSubject<number>(5);
  private gameStateSubject: BehaviorSubject<string> = new BehaviorSubject<string>('waiting-ready');
  public players = this.playersSubject.asObservable();
  public showman = this.showmanSubject.asObservable();
  public maxPlayers = this.maxPlayersSubject.asObservable();
  public gameState = this.gameStateSubject.asObservable();
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
      console.log(data);
    });
  }

  getGames(games: Game[]) {
    this.socket.emit("get-game-list", (gameList: Game[]) => games.push(...gameList))
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
    this.socket.emit("join-game", { gameId, name: 'test', type }, (data: any) => {
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
