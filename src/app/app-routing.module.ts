import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './components/pages/games/games.component';
import { HomeComponent } from './components/pages/home/home.component';
import { NewgameComponent } from './components/pages/newgame/newgame.component';

const routes: Routes = [{ path: 'games', component: GamesComponent },
{ path: 'newgame', component: NewgameComponent },
{ path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
