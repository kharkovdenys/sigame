import { animate, keyframes, query, style, transition, trigger, stagger, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import Atom from 'src/app/interfaces/Atom';
import Position from 'src/app/interfaces/Position';
import Question from 'src/app/interfaces/Question';
import Theme from 'src/app/interfaces/Theme';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css'],
  animations: [
    trigger('themes', [
      transition(':enter', [
        animate('{{time}}s', keyframes([
          style({ transform: 'translate(0, 100%)', visibility: 'visible' }),
          style({ transform: 'translate(0, -100%)', visibility: 'hidden' }),
        ]))
      ])
    ]),
    trigger('round-themes', [
      transition(
        ':enter', [
        animate('1s', keyframes([
          style({ opacity: 0 }),
          style({ opacity: 1 }),
        ]))
      ]
      )
    ]),
    trigger('read', [
      transition(
        ':enter',
        query('.letter', [
          style({ color: '#fff' }),
          stagger(200, animate(100, style({ color: '#0ff' }))),
        ])
      ),
    ]),
    trigger('choose', [
      transition('false => true', animate('1s', keyframes([
        style({ 'background-color': 'rgba(27, 98, 240, 1)' }),
        style({ 'background-color': '#fff' }),
        style({ 'background-color': 'rgba(27, 98, 240, 1)' }),
        style({ 'background-color': '#fff' }),
        style({ 'background-color': 'rgba(27, 98, 240, 1)' }),
      ])))
    ])
  ]
})
export class ScreenComponent implements OnChanges {
  constructor(
    private socketService: SocketService,
    private _builder: AnimationBuilder
  ) { }
  @Input() gameState!: string;
  expectation = 'Waiting for the start';
  @Input() themes!: Theme[];
  @Input() roundName?: string;
  @Input() chooser?: string;
  roundThemesText?: string;
  @Input() questions!: Question[];
  @Input() playerName: string | undefined;
  @Input() position!: Position;
  @Input() typeRound?: 'final' | 'default';
  @Input() atom?: Atom;
  @Input() gameId?: string;
  @Input() pause?: boolean;
  @ViewChild('loading') loading?: ElementRef;
  apiUrl = environment.apiUrl;
  playerLoading?: AnimationPlayer;
  loadingAnimation = this._builder.build([
    style({ 'border': '4px', 'border-color': 'white', 'border-style': 'solid' }),
    animate('{{time}}s', keyframes([
      style(
        {
          'clip-path': 'polygon(0% 100%, 4px 100%, 4px 4px, calc(100% - 4px) 4px, calc(100% - 4px) calc(100% - 4px), 4px calc(100% - 4px), 4px 100%, 100% 100%, 100% 0%, 0% 0%)', offset: 0
        }),
      style(
        {
          'clip-path': 'polygon(0 100%, 4px 100%, 4px 4px, calc(100% - 4px) 4px, calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 100% 100%, 100% 0%, 0% 0%)', offset: 0.25
        }),
      style({
        'clip-path': 'polygon(0% 100%, 4px 100%, 4px 4px, calc(100% - 4px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 4px, 100% 0%, 0% 0%)', offset: 0.5
      }),
      style({
        'clip-path': 'polygon(0% 100%, 4px 100%, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 4px, 4px 0%, 0% 0%)', offset: 0.75
      }),
      style({
        'clip-path': 'polygon(0% 100%, 4px 100%, 4px 100%, 4px 100%, 4px 100%, 4px 100%, 4px 100%, 4px 100%, 4px 100%, 0% 100%)', offset: 1
      }),
    ]))]);

  columns(max: number): string[] {
    const input = ['name'];
    for (let i = 0; i < max; i += 1) {
      input.push(i.toString());
    }
    return input;
  }

  maxColumns(): number {
    let i = 0;
    for (const questions of this.questions) {
      if (questions.prices.length > i)
        i = questions.prices.length;
    }
    return i;
  }

  sendChooseQuestion(i: number, j: number): void {
    console.log(i, j);
    this.socketService.sendChooseQuestion(i, j);
  }

  sendChooseTheme(i: number) {
    this.socketService.sendChooseTheme(i);
  }

  split(word: string): string[] {
    return [...word];
  }

  getThemes() {
    let str = '';
    for (const theme of this.themes) {
      str += theme.name + '\n';
    }
    return str;
  }

  timing() {
    return this.socketService.timing;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gameState'] && changes['gameState'].currentValue === 'show-round-themes') {
      let i = 0;
      const changeRoundThemesText = () => {
        if (i === 0) {
          this.roundThemesText = this.roundName;
        } else {
          if (i - 1 >= this.themes.length) {
            clearInterval(roundThemes);
          } else {
            this.roundThemesText = this.themes[i - 1].name;
          }
        }
        i++;
      }
      changeRoundThemesText();
      const roundThemes = setInterval(() => changeRoundThemesText(), 2000);
    } else if (changes['gameState'] && changes['gameState'].currentValue === 'can-answer') {
      this.playerLoading = this.loadingAnimation.create(this.loading?.nativeElement, { params: { time: this.timing() } });
      this.playerLoading.play();
    }
    if (changes['gameState'] && changes['gameState'].currentValue !== 'can-answer') {
      this.playerLoading?.destroy();
      this.playerLoading = undefined;
    }
    if (changes['pause']) {
      changes['pause'].currentValue ? this.playerLoading?.pause() : this.playerLoading?.play();
    }
  }
}
