import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/_model/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
@Input() username?: string;
@Input()  messages: Message[]=[];
messageContent: '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  
  }

sendMessage()
{
  this.messageService.sendMessage(this.username, this.messageContent).subscribe({
    next: message => this.messages.push(message)
  });
}
}
