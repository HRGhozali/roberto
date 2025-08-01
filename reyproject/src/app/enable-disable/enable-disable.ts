import { Component, Inject } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpService } from '../http-service';

@Component({
  selector: 'app-enable-disable',
  imports: [ReactiveFormsModule],
  templateUrl: './enable-disable.html',
  styleUrl: './enable-disable.css'
})
export class EnableDisable {
isWaitingResponse = false;
  enableDisable_form = new FormGroup({
    id: new FormControl('', [Validators.required]),
    session: new FormControl('', [Validators.required]),
    enDis: new FormControl('', [Validators.required,]),
  });

  constructor(private httpService: HttpService = Inject(HttpService)) {}

  enableDisable() {  // Do later
    this.isWaitingResponse = true;
    try {
      if (this.enableDisable_form.value?.enDis == "enable") {
        this.httpService.postDataNoAuth("users/enable", {
          id: this.enableDisable_form.value?.id,
          session: this.enableDisable_form.value?.session,
          enDis: this.enableDisable_form.value?.enDis
        }).subscribe((res) => {
            console.log(`Successful user enable`);
            alert(`Success`);
          }, 
          error => {
            console.error("Error enabling user: ", error?.message, error?.error?.message);
            alert(`Failed to enable user: ${error?.error?.message}`);
          }
        );
      }
      else {
        this.httpService.postDataNoAuth("users/disable", {
          id: this.enableDisable_form.value?.id,
          session: this.enableDisable_form.value?.session,
          enDis: this.enableDisable_form.value?.enDis
        }).subscribe((res) => {
            console.log(`Successful user disable`);
            alert(`Success`);
          }, 
          error => {
            console.error("Error disabling user: ", error?.message, error?.error?.message);
            alert(`Failed to disable user: ${error?.error?.message}`);
          }
        );
      }
    } catch(error) {
      console.error("Error enabling/disabling: ", error);
      alert(`Failed to enable/disable user: ${error}`);
    } finally {
      this.isWaitingResponse = false;
    }
  }
}
