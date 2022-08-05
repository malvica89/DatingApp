import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { user } from '../_model/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model : any = {}
  //loggedIn : boolean;
 //currentUser$:Observable<user>;
  constructor(public accountService:AccountService) { }

  ngOnInit(): void {
    //this.currentUser$ = this.accountService.currentUser$;
    //this.GetCurrentUser();
  }

    login()
    {
      this.accountService.login(this.model).subscribe(response=>{
        console.log(response);
        //this.loggedIn = true;
      }, error=>
      {
        console.log(error);
      });
     
    }

    logout(){
      this.accountService.logout();
     // this.loggedIn = false;
    }

    // GetCurrentUser()
    // {
    //   this.accountService.currentUser$.subscribe(user =>
    //     {
    //       this.loggedIn = !!user;
    //     },
    //     error=>
    //     {
    //       console.log(error);
    //     })
    // }
}
