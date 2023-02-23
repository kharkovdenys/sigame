import { SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
    url: environment.socketUrl,
    options: {
        transports: ['websocket']
    }
}
export default config;