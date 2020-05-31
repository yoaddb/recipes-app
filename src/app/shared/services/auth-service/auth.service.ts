import { environment } from './../../../../environments/environment';
import { User } from './../../models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    const body = {
      email,
      password,
      returnSecureToken: true
    };
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.firebaseAPIKey,
        body
      )
      .pipe(catchError(this.handleErrorResponse), tap(this.handleUserCreation));
  }

  login(email: string, password: string) {
    const body = {
      email,
      password,
      returnSecureToken: true
    };
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
        body
      )
      .pipe(catchError(this.handleErrorResponse), tap(this.handleUserCreation));
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      const tokenExpirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();

      this.user.next(loadedUser);
      this.autoLogout(tokenExpirationDuration);
    }
  }

  private handleErrorResponse(errorRes: HttpErrorResponse) {
    let error = 'An unknown error occurred.';
    if (!errorRes.error || !errorRes.error.error) return throwError(error);

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        error = 'This email already exists.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        error = 'Requested operation is not allowed.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        error = 'Too many attempts were made. Please try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        error = 'Email not found.';
        break;
      case 'INVALID_PASSWORD':
        error = 'Invalid password.';
        break;
      case 'USER_DISABLED':
        error = 'This account has been disabled.';
        break;
    }
    return throwError(error);
  }

  private handleUserCreation = (resData: AuthResponseData) => {
    const tokenExpirationDuration = +resData.expiresIn * 1000; //expiresIn in ms
    const user = new User(
      resData.email,
      resData.localId,
      resData.idToken,
      new Date(new Date().getTime() + tokenExpirationDuration)
    );
    localStorage.setItem('userData', JSON.stringify(user));
    this.user.next(user);
    this.autoLogout(tokenExpirationDuration);
  };

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
