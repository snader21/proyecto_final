import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    Select,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public languages = [{name: 'Español'}, {name: 'English'}];
  public language = this.languages[0];
}
