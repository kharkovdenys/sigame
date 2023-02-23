import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './components/pages/game/game.component';
import { GamesComponent } from './components/pages/games/games.component';
import { HomeComponent } from './components/pages/home/home.component';
import { NewgameComponent } from './components/pages/newgame/newgame.component';

const routes: Routes = [{ path: 'games', component: GamesComponent },
{ path: 'newgame', component: NewgameComponent },
{ path: 'game', component: GameComponent },
{ path: '', component: HomeComponent },
{ path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
