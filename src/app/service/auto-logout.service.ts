//import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Injectable, NgZone } from '@angular/core';

const MINUTES_UNITL_AUTO_LOGOUT = 60 // in Minutes
const CHECK_INTERVAL = 1000 // in ms
const STORE_KEY = 'lastAction';

@Injectable()
export class AutoLogoutService {

  constructor(
      private authService: AuthService,
      private ngZone: NgZone
  ) { 
      this.check();
      this.initListener();
      this.initInterval();
  }

      get lastAction() {
        const lcItem = localStorage.getItem(STORE_KEY);
        if (lcItem) {
            return parseInt(lcItem);
        }
    }
    set lastAction(value: any) {
        localStorage.setItem(STORE_KEY, value);
    }

    initListener() {
       
        
      this.ngZone.runOutsideAngular(() => {
          document.body.addEventListener('click', () => this.reset());
      });
    }
    initInterval() {  
      this.ngZone.runOutsideAngular(() => {
          setInterval(() => {
              this.check();
          }, CHECK_INTERVAL);
      })
    }

    reset() {
      this.lastAction = Date.now();
    }

    check() {
      const now = Date.now();
      const timeleft = this.lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
      const diff = timeleft - now;
      const isTimeout = diff < 0;
      // if(diff !== NaN && (diff >= ALERT_BEFORE_TIMEOUT_MIN && diff <= ALERT_BEFORE_TIMEOUT_MAX)){
      //     this.notify.alertToast(`Sytem is going to logged out due to ${MINUTES_UNITL_AUTO_LOGOUT} Minutes of inactivity. Please click anywhere on a screen to prevent auto logged out`)
      // }
      // let i = 1;
      // console.log('is' + i, isTimeout);
      // i++;
      this.ngZone.run(() => {
          if (isTimeout && this.authService.IsLoggedIn()) {
              // console.log(`Sie wurden automatisch nach ${this.MINUTES_UNITL_AUTO_LOGOUT} Minuten Inaktivität ausgeloggt.`);
              //  console.log(`Sytem logged out automatically after ${this.MINUTES_UNITL_AUTO_LOGOUT} Minutes of inactivity.`);
              localStorage.removeItem(STORE_KEY);
              this.authService.ProceedLogOut();
          }
      });
    }

}
