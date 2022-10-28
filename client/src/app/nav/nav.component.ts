import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  constructor(public accountService:AccountService, private router:Router, private toastr:ToastrService) { 

  }

  ngOnInit(): void {
    //this.currentUser$ = this.accountService.currentUser$;
    //this.GetCurrentUser();
  }

    login()
    {
      this.accountService.login(this.model).subscribe(response=>{
        console.log(response);
        this.router.navigateByUrl('/members');
        //this.loggedIn = true;
      });
     
    }

    logout(){
      this.accountService.logout();
      this.router.navigateByUrl('/');
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
