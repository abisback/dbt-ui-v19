import { Component } from '@angular/core';
import { share } from 'rxjs';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-public-header',
  imports: [SharedModule],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss'
})
export class PublicHeaderComponent {

}
