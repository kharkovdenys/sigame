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
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule } from 'ngx-socket-io';
import { GamesComponent } from './components/pages/games/games.component';
import { NewgameComponent } from './components/pages/newgame/newgame.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/pages/home/home.component';
import config from './services/socket.config';
import { GameComponent } from './components/pages/game/game.component';
import { DialogNameComponent } from './components/pages/home/dialog/dialog-name.component';
import { PlayersComponent } from './components/pages/game/players/players.component';
import { DialogJoinComponent } from './components/pages/games/dialog/dialog.component';
import { ScreenComponent } from './components/pages/game/screen/screen.component';
import { CdkTableModule } from '@angular/cdk/table';
import { DialogScoreComponent } from './components/pages/game/players/dialog/dialog.component';
import { DialogRatesComponent } from './components/pages/game/ratesdialog/ratesdialog.component';
import { DialogAnswerComponent } from './components/pages/game/answerdialog/answerdialog.component';

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
    DialogAnswerComponent
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
