import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection } from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../_model/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;

  constructor(private toastr: ToastrService) { }

  createHubConnection(user: User)
  {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'presence', {
      accessTokenFactory:()=> user.token,
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start().catch(error => (console.log(error)));

    this.hubConnection.on('UserIsOnline', test =>{
      this.toastr.info(test + ' Has connected');
    });

    this.hubConnection.on('UserIsOffline', test =>{
      this.toastr.info(test + ' Has disconnected');
    });
  }

  stopHubConnection(){
    this.hubConnection.stop().catch(error => (console.log(error)));
  }
}
