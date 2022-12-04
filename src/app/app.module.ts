import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from "@angular/material/slider";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from '@angular/material/card';
import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule } from 'ngx-socket-io';
import { GamesComponent } from './components/pages/games/games.component';
import { NewgameComponent } from './components/pages/newgame/newgame.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/pages/home/home.component';
import config from './services/socket.config';
import { GameComponent } from './components/pages/game/game.component';
import { DialogName } from './components/pages/home/dialog/dialog-name.component';
import { PlayersComponent } from './components/pages/game/players/players.component';

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    NewgameComponent,
    HomeComponent,
    GameComponent,
    DialogName,
    PlayersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSliderModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    NgxMatFileInputModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
