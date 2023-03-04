import axios, { AxiosProgressEvent } from 'axios';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';

import { Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-newgame',
  templateUrl: './newgame.component.html',
  styleUrls: ['./newgame.component.css']
})
export class NewgameComponent {
  apiUrl = environment.apiUrl;
  name = "";
  maxPlayers = 5;
  file?: File;
  maxSize = 150;
  percentCompleted = 0;

  constructor(private socketService: SocketService, private snackBar: MatSnackBar) { }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    if (!event) return;
    this.file = event.item(0) || undefined;
    if (!this.file) {
      this.snackBar.open('The file was not attached', 'Close', { duration: 3000 });
      return;
    }
    if (this.file.size > 1048576 * this.maxSize) {
      this.file = undefined;
      this.snackBar.open(`The file exceeds the maximum size of ${this.maxSize} MB`, 'Close', { duration: 3000 });
      return;
    }
    const formData = new FormData();
    formData.append('file', this.file);
    axios.post(this.apiUrl + '/upload/pack/' + this.socketService.getId(), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total)
          this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      }
    })
      .then(() => {
        this.snackBar.open('File uploaded successfully', 'Close', { duration: 3000 });
      })
      .catch(() => {
        this.percentCompleted = 0;
        this.file = undefined;
        this.snackBar.open('An error occurred while uploading the file', 'Close', { duration: 3000 });
      });
  }

  create() {
    if (!this.file) {
      this.snackBar.open('File not attached', 'Close', { duration: 3000 });
      return;
    }
    if (this.name) this.socketService.create(this.name, this.maxPlayers);
  }
}
