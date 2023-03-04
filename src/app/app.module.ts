import { SocketIoModule } from 'ngx-socket-io';

import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogAnswerComponent } from './components/dialogs/answerdialog/answerdialog.component';
import { DialogAnsweringComponent } from './components/dialogs/answeringdialog/answeringdialog.component';
import { DialogFinalAnswerComponent } from './components/dialogs/finalanswerdialog/finalanswerdialog.component';
import { GameComponent } from './components/pages/game/game.component';
import { DialogScoreComponent } from './components/dialogs/scoredialog/scoredialog.component';
import { PlayersComponent } from './components/pages/game/players/players.component';
import { DialogRatesComponent } from './components/dialogs/ratesdialog/ratesdialog.component';
import { ScreenComponent } from './components/pages/game/screen/screen.component';
import { DialogJoinComponent } from './components/dialogs/joindialog/joindialog.component';
import { GamesComponent } from './components/pages/games/games.component';
import { DialogNameComponent } from './components/dialogs/namedialog/namedialog.component';
import { HomeComponent } from './components/pages/home/home.component';
import { NewgameComponent } from './components/pages/newgame/newgame.component';
import config from './services/socket.config';

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    NewgameComponent,
    HomeComponent,
    GameComponent,
    DialogNameComponent,
    PlayersComponent,
    DialogJoinComponent,
    ScreenComponent,
    DialogScoreComponent,
    DialogRatesComponent,
    DialogAnswerComponent,
    DialogFinalAnswerComponent,
    DialogAnsweringComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CdkTableModule,
    MatButtonModule,
    MatSliderModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressBarModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
