import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_model/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseurl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model:any)
  {
    return this.http.post(this.baseurl+"account/login", model).pipe(
      map((response:User) => {
        const user = response;
        if(user)
        {
          this.SetCurrentUser(user);
        }
      })
    );
  }

  register(model: any)
  {
    return this.http.post(this.baseurl +'account/register',model).pipe(
      map((user: User)=>{
        if(user){
          this.SetCurrentUser(user);
        }
        return user;
      }
      )
    )
  }

  SetCurrentUser(user: User)
  {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles:user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout()
  {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string)
  {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
