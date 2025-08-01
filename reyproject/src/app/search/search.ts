import { Component, Inject } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpService } from '../http-service';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {
isWaitingResponse = false;
  searchMany_form = new FormGroup({
    search: new FormControl(''),
    getActive: new FormControl('', [Validators.required]),
  });

  searchOne_form = new FormGroup({
    id: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private httpService: HttpService = Inject(HttpService)) {}

  searchMany() {  // Do later
    this.isWaitingResponse = true;
    try {
      this.httpService.postDataNoAuth("users/edit", {
        search: this.searchMany_form.value?.search,
        getActive: this.searchMany_form.value?.getActive,
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

  searchOne() {  // Do later
    this.isWaitingResponse = true;
    try {
      this.httpService.postDataNoAuth("users/edit", {
        id: this.searchOne_form.value?.id,
        email: this.searchOne_form.value?.email,
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
