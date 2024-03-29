import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_model/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users:any;

  constructor( private accountservice: AccountService){}

  ngOnInit(){
//this.getUsers();
this.SetCurrentUser();
  }

  SetCurrentUser()
  {
    const user:User = JSON.parse(localStorage.getItem('user'));
    if(user != null)
      this.accountservice.SetCurrentUser(user);
  }

  // getUsers(){
  //   this.http.get('https://localhost:5001/api/users').subscribe({
  //     next:response=>this.users = response,
  //     error:error=>console.log(error)
  //   })
  // }
}
