import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {Password} from 'primeng/password';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    Select,
    FormsModule,
    Button,
    Password,
    IconField,
    InputIcon
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public languages = [{name: 'Español'}, {name: 'English'}];
  public language = this.languages[0];
}
