import { Component } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

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

  async addUsers() {  // Do later
    this.isWaitingResponse = true;
    

    this.isWaitingResponse = false;
  }
}
