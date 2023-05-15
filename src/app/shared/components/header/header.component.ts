import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isUserLoggedIn!: boolean;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.isUserLoggedIn.subscribe((value) => {
      this.isUserLoggedIn = value;
    });
    this.isUserLoggedIn = this.authService.isLoggedIn
    document.addEventListener('logged-in', () => {
      this.isUserLoggedIn = true;
    });
    document.addEventListener('logged-out', () => {
      this.isUserLoggedIn = false;
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl("/signin");
    this.authService.setIsUserLoggedIn(false);
  }


}
