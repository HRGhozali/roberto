import { Component } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css'
})
export class EditUser {
  isWaitingResponse = false;
  editUsers_form = new FormGroup({
    id: new FormControl('', [Validators.required]),
    session: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile: new FormControl(''),
    accessLevel: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.min(1), Validators.max(4)]),
  });

  editUsers() {  // Do later

  }
}
