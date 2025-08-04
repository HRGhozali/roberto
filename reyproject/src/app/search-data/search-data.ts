import { Component, input } from '@angular/core';
import {SearchResults} from '../search-results';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-search-data',
  imports: [CommonModule, RouterModule],
  templateUrl: './search-data.html',
  styleUrl: './search-data.css'
})
export class SearchData {
  searchData = input.required<SearchResults>();
}
