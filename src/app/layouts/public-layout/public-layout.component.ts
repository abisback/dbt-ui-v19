import { Component } from '@angular/core';
import { PublicHeaderComponent } from '../../shared/public-header/public-header.component';
import { SharedModule } from '../../shared/shared.module';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SignInComponent } from '../../auth/sign-in/sign-in.component';

@Component({
  selector: 'app-public-layout',
  imports: [SharedModule, PublicHeaderComponent,FooterComponent],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {

}
