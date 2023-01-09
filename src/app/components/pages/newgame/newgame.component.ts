import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-newgame',
  templateUrl: './newgame.component.html',
  styleUrls: ['./newgame.component.css']
})
export class NewgameComponent implements OnInit {
  fileControl: FormControl;
  file?: File;
  maxSize = 100;

  constructor(
    private socketService: SocketService
  ) {
    this.fileControl = new FormControl(this.file, [
      Validators.required,
      MaxSizeValidator(this.maxSize * 1048576)
    ]);
  }
  name = "";
  maxPlayers = 5;
  ngOnInit() {
    this.fileControl.valueChanges.subscribe((file?: File) => {
      if (file && this.fileControl.valid) {
        this.file = file;
        this.socketService.upload(this.file);
      }
    })
  }

  create() {
    if (this.file && this.fileControl.valid && this.name !== '') {
      this.socketService.create(this.name, this.maxPlayers);
    }
  }
}
