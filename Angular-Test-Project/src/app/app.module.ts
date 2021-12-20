import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ButtonComponent } from './components/button/button.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { AddUpdateTaskComponent } from './components/add-update-task/add-update-task.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { AboutComponent } from './components/about/about.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';
import { TokenIterceptorService } from './services/token-iterceptor.service';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { NavigateBackButtonComponent } from './components/navigate-back-button/navigate-back-button.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'signup', component: SignUpComponent },
  {path: '', component: MainContentComponent, canActivate: [AuthGuard] },
  {path: 'about', component: AboutComponent },
  {path: 'accountSettings', component: AccountSettingsComponent, canActivate: [AuthGuard]},
  {path: 'changePassword', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'forgotPassword', component: ForgotPasswordComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ButtonComponent,
    TasksComponent,
    TaskItemComponent,
    AddUpdateTaskComponent,
    MainContentComponent,
    AboutComponent,
    FooterComponent,
    LoginComponent,
    SignUpComponent,
    AccountSettingsComponent,
    NavigateBackButtonComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, {enableTracing: true})
  ],
  providers: [AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenIterceptorService,
    multi: true 
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
