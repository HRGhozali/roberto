import { Component, Inject } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpService } from '../http-service';

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
    mobile: new FormControl(''),
    accessLevel: new FormControl('', [Validators.required, Validators.maxLength(1), Validators.min(1), Validators.max(4)]),
  });

  constructor(private httpService: HttpService = Inject(HttpService)) {}

  editUsers() {  // Do later
    this.isWaitingResponse = true;
    try {
      this.httpService.postDataNoAuth("users/edit", {
        id: this.editUsers_form.value?.id,
        session: this.editUsers_form.value?.session,
        firstName: this.editUsers_form.value?.firstName,
        lastName: this.editUsers_form.value?.lastName,
        mobile: this.editUsers_form.value?.mobile,
        accessLevel: this.editUsers_form.value?.accessLevel,
        password: this.editUsers_form.value?.password,
      }).subscribe((res) => {
          console.log(`Successful user edit`);
          alert(`Success`);
        }, 
        error => {
          console.error("Error editing user: ", error?.message, error?.error?.message);
          alert(`Failed to edit user: ${error?.error?.message}`);
        }
      );
    } catch(error) {
      console.error("Error editing user: ", error);
      alert(`Failed to edit user: ${error}`);
    } finally {
      this.isWaitingResponse = false;
    }
  }
}
