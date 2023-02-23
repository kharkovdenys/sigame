import axios, { AxiosProgressEvent } from 'axios';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';

import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-newgame',
  templateUrl: './newgame.component.html'
})
export class NewgameComponent implements OnInit {
  fileControl: FormControl;
  file?: File;
  maxSize = 150;

  constructor(
    private socketService: SocketService
  ) {
    this.fileControl = new FormControl(this.file, [
      Validators.required,
      MaxSizeValidator(this.maxSize * 1048576)
    ]);
  }
  percentCompleted = 0;
  name = "";
  maxPlayers = 5;
  apiUrl = environment.apiUrl;
  ngOnInit() {
    this.fileControl.valueChanges.subscribe((file?: File) => {
      if (file && this.fileControl.valid) {
        const formData = new FormData();
        formData.append('file', file);
        this.file = file;

        axios.post(this.apiUrl + '/upload/pack/' + this.socketService.getId(), formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total)
              this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          }
        })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            this.percentCompleted = 0;
            console.log(error);
          });
      }
    })
  }

  create() {
    if (this.fileControl.value && this.fileControl.valid && this.name !== '') {
      this.socketService.create(this.name, this.maxPlayers);
    }
  }
}
