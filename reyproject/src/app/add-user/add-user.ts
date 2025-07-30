import { Component, Inject } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpService } from '../http-service';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css'
})
export class AddUser {
  isWaitingResponse = false;
  addUsers_form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
    mobile: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    accessLevel: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.min(1), Validators.max(4)]),
  });

  constructor(private httpService: HttpService = Inject(HttpService)) {}

  async addUsers() {  // Do later
    this.isWaitingResponse = true;
    try {
      this.httpService.postDataNoAuth("users/login", {
        firstName: this.addUsers_form.value?.firstName,
        lastName: this.addUsers_form.value?.lastName,
        password: this.addUsers_form.value?.password,
        mobile: this.addUsers_form.value?.mobile,
        email: this.addUsers_form.value?.email,
        accessLevel: this.addUsers_form.value?.accessLevel,
      }).subscribe((res) => {
          console.log(`Successful creation`);
          alert(`Success`);
        }, 
        error => {
          console.error("Error creating: ", error?.message, error?.error?.message);
          alert(`Failed to create: ${error?.error?.message}`);
        }
      );
    } catch(error) {
      console.error("Error creating: ", error);
      alert(`Failed to create: ${error}`);
    } finally {
      this.isWaitingResponse = false;
    }
  }
}
