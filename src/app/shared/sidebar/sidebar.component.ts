import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { USERROLE } from '../../../app_enum';
import { share } from 'rxjs';
import { SharedModule } from '../shared.module';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [SharedModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  IsNotOperator: boolean = true;
  IsStateLevel: boolean = false;
  IsSuperAdmin: boolean = false;
  IsNodal: boolean = false;
  IsStateNodal: boolean = false;
  IsDepartmentAdmin: boolean = false;

  //-------------------
  // @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  //--------------------

  @Output() toggleSideBar = new EventEmitter<void>();
  constructor(private router: Router) {}

  ngOnInit(): void {
    let userRole = localStorage.getItem('role');
    // console.log(userRole);

    if (userRole == USERROLE['Department Operator']) {
      this.IsNotOperator = false;
    }
    if (userRole == USERROLE['Department Admin']) {
      this.IsDepartmentAdmin = true;
    }

    if (userRole == USERROLE['Super Admin']) {
      this.IsSuperAdmin = true;
    }

    if (userRole == USERROLE['State Level Admin']) {
      this.IsStateLevel = true;
    }
    if (userRole == USERROLE['Department Nodal']) {
      this.IsNodal = true;
    }
    if (userRole == USERROLE['State Nodal']) {
      this.IsStateNodal = true;
    }
  }
  //-----------------------
  // mouseenter() {
  //   if (!this.isExpanded) {
  //     this.isShowing = true;
  //   }
  // }

  // mouseleave() {
  //   if (!this.isExpanded) {
  //     this.isShowing = false;
  //   }
  // }

  //-----------------------
  ngAfterViewInit() {
    // Listen to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.toggleSideBar.emit();
      }
    });
  }
}
