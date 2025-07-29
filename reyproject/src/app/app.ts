import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import {provideRouter} from '@angular/router';
import routeConfig from './routes';
import {HttpClient}  from  '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('reyproject');
}
