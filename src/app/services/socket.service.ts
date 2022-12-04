import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import Game from '../interfaces/Game';
import Player from '../interfaces/Player';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private playersSubject: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
  public players = this.playersSubject.asObservable();

  constructor(private socket: Socket) {

    this.socket.on("player-joined", (player: Player) => {
      console.log("player joined", player);
      const players = this.playersSubject.getValue();
      players.push(player);
      this.playersSubject.next(players);
    });

    this.socket.on("player-leave", (playerId: string) => {
      console.log("got playerLeft");
      let players = this.playersSubject.getValue();
      players = players.filter((player) => player.id !== playerId);
      this.playersSubject.next(players);
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

  changeReady(gameid: string) {
    this.socket.emit("change-ready", { gameId: gameid }, (status: any) => {
      console.log(status);
    });
  }

  start(gameid: string) {
    this.socket.emit("start", { gameId: gameid }, (status: any) => {
      console.log(status);
    });
  }

  leave(gameid: string) {
    this.socket.emit("leave-room", gameid);
  }

  join(gameid: string, router: Router) {
    this.socket.emit("join-game", { gameId: gameid, name: 'test' }, (data: any) => {
      if (data.status === 'success') {
        this.playersSubject.next(data.players);
        router.navigate(['/game'], {
          state: { gameId: data.gameId, showman: data.showman, maxPlayers: data.maxPlayers }, replaceUrl: true
        });
      }
      else {
        console.log(data);
      }
    });
  }

  create(name: string, maxPlayers: number, router: Router) {
    this.socket.emit("create-game", { name, maxPlayers, showmanName: localStorage.getItem('name') }, (data: any) => {
      if (data.status === 'success') {
        router.navigate(['/game'], {
          state: { gameId: data.gameId, showman: data.showman, maxPlayers: data.maxPlayers }, replaceUrl: true
        });
        this.playersSubject.next([]);
      }
      else {
        console.log(data);
      }
    });
  }
}
