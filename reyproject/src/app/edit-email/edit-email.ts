import { Component, Inject } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpService } from '../http-service';

@Component({
  selector: 'app-edit-email',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-email.html',
  styleUrl: './edit-email.css'
})
export class EditEmail {
  isWaitingResponse = false;
  editEmail_form = new FormGroup({
    id: new FormControl('', [Validators.required]),
    session: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private httpService: HttpService = Inject(HttpService)) {}

  editEmail() {  // Do later
    this.isWaitingResponse = true;
    try {
      this.httpService.postDataNoAuth("users/editEmail", {
        id: this.editEmail_form.value?.id,
        session: this.editEmail_form.value?.session,
        email: this.editEmail_form.value?.email
      }).subscribe((res) => {
          console.log(`Successful email edit`);
          alert(`Success`);
        }, 
        error => {
          console.error("Error editing email: ", error?.message, error?.error?.message);
          alert(`Failed to edit email: ${error?.error?.message}`);
        }
      );
    } catch(error) {
      console.error("Error editing email: ", error);
      alert(`Failed to edit email: ${error}`);
    } finally {
      this.isWaitingResponse = false;
    }
  }
}
