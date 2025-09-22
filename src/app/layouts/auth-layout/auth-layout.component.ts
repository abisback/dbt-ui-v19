import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-auth-layout',
  imports: [SharedModule, SidebarComponent, FooterComponent, HeaderComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  sideBarOpen = false;

  constructor() {}
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
