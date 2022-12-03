import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketIoModule } from 'ngx-socket-io';
import config from 'src/app/services/socket.config';

import { NewgameComponent } from './newgame.component';

describe('NewgameComponent', () => {
  let component: NewgameComponent;
  let fixture: ComponentFixture<NewgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocketIoModule.forRoot(config)],
      declarations: [NewgameComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
