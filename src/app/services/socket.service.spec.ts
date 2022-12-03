import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { SocketIoModule } from 'ngx-socket-io';
import config from './socket.config';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SocketIoModule.forRoot(config)],
      providers: [SocketService]
    });
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
