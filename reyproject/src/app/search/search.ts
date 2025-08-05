import { Component, Inject } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpService } from '../http-service';
import {SearchResults} from '../search-results';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {
  isWaitingResponse = false;
  searchList: SearchResults[] = [];
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
          console.log(`Successful search`);
          for (let i = 0; i < res.userMatches.length; i++) {
            let match : SearchResults = {
              id: res.userMatches[i].id,
              fullName: `${res.userMatches[i].firstName} ${res.userMatches[i].lastName}`,
              email: res.userMatches[i].email,
              session: -1,
              createdBy: 'irrelevant',
              updatedBy: 'irrelevant',
              isList: true,
              accessName: res.userMatches[i].accessName,
              active: res.userMatches[i].active
            }
            this.searchList.push(match);
          }
          alert(`Success`);
        }, 
        error => {
          console.error("Error searching: ", error?.message, error?.error?.message);
          alert(`Failed to search: ${error?.error?.message}`);
        }
      );
    } catch(error) {
      console.error("Error searching: ", error);
      alert(`Failed to search: ${error}`);
    } finally {
      this.isWaitingResponse = false;
    }
  }

  searchOne() {  // Do later
    this.isWaitingResponse = true;
    this.searchList = [];
    try {
      this.httpService.postDataNoAuth("users/edit", {
        id: this.searchOne_form.value?.id,
        email: this.searchOne_form.value?.email,
      }).subscribe((res) => {
          console.log(`Successful search`);
          for (let i = 0; i < res.userMatches.length; i++) {
            let match : SearchResults = {
              id: res.userMatches[i].id,
              fullName: res.userMatches[i].fullName,
              email: res.userMatches[i].email,
              session: res.userMatches[i].session,
              createdBy: res.userMatches[i].createdBy,
              updatedBy: res.userMatches[i].updatedBy,
              isList: false,
              accessName: 'irrelevant',
              active: true
            }
            this.searchList.push(match);
          }
          alert(`Success`);
        }, 
        error => {
          console.error("Error search: ", error?.message, error?.error?.message);
          alert(`Failed to search: ${error?.error?.message}`);
        }
      );
    } catch(error) {
      console.error("Error search: ", error);
      alert(`Failed to search: ${error}`);
    } finally {
      this.isWaitingResponse = false;
    }
  }
}
