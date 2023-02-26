import { SocketIoModule } from 'ngx-socket-io';

import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogAnswerComponent } from './components/pages/game/answerdialog/answerdialog.component';
import { DialogAnsweringComponent } from './components/pages/game/answeringdialog/answeringdialog.component';
import { GameComponent } from './components/pages/game/game.component';
import { DialogScoreComponent } from './components/pages/game/players/dialog/dialog.component';
import { PlayersComponent } from './components/pages/game/players/players.component';
import { DialogRatesComponent } from './components/pages/game/ratesdialog/ratesdialog.component';
import { ScreenComponent } from './components/pages/game/screen/screen.component';
import { DialogJoinComponent } from './components/pages/games/dialog/dialog.component';
import { GamesComponent } from './components/pages/games/games.component';
import { DialogNameComponent } from './components/pages/home/dialog/dialog-name.component';
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
    DialogAnsweringComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CdkTableModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSliderModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressBarModule,
    NgxMatFileInputModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
