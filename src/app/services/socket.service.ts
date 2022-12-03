import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import Game from '../interfaces/Game';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  getGames(games: Game[]) {
    this.socket.emit("get-game-list", (gameList: Game[]) => games.push(...gameList))
  }

  upload(file: File) {
    this.socket.emit("upload-pack", file, (status: any) => {
      console.log(status);
    });
  }

  create(name: string, maxPlayers: number) {
    this.socket.emit("create-game", { name, maxPlayers }, (status: any) => {
      console.log(status);
    });
  }
}
