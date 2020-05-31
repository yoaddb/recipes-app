import { PlaceholderDirective } from './../shared/directives/placeholder/placeholder.directive';
import { AlertComponent } from './../alert/alert.component';
import {
  AuthService,
  AuthResponseData
} from './../shared/services/auth-service/auth.service';
import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    const { email, password } = form.value;
    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;

    authObs = this.isLoginMode
      ? this.authService.login(email, password)
      : this.authService.signUp(email, password);

    authObs.subscribe(
      resData => {
        this.router.navigate(['/recipes']);
        this.isLoading = false;
      },
      error => {
        this.showErrorAlert(error);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    this.alertHost.viewContainerRef.clear();

    const componentRef = this.alertHost.viewContainerRef.createComponent(
      alertCmpFactory
    );

    componentRef.instance.message = message;
    this.subscription = componentRef.instance.close.subscribe(() => {
      this.subscription.unsubscribe();
      this.alertHost.viewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
