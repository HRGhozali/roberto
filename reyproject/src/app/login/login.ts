import { Component, Inject } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpService } from '../http-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  isWaitingResponse = false;
  login_form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',Validators.required),
  });

  constructor(private httpService: HttpService = Inject(HttpService)) {}

  login() {  // finish later
    this.isWaitingResponse = true;
    try {
      this.httpService.postDataNoAuth("users/login", {
        email: this.login_form.value?.email,
        password: this.login_form.value?.password,
      }).subscribe((res) => {
          console.log(`Successful login`);
          alert(`Success`);
        }, 
        error => {
          console.error("Error logging in:", error?.message, error?.error?.message);
          alert(`Failed to log in: ${error?.error?.message}`);
        }
      );
    } catch(error) {
      console.error("Error logging in:", error);
      alert(`Failed to log in: ${error}`);
    } finally {
      this.isWaitingResponse = false;
    }
  };
}
