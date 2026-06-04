import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authService = inject(AuthService);

  onLogin(email: string, password: string) {
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response.user);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    })
  }

  onLoginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
    next: (res) => {
      console.log('Logado com sucesso!', res.user);
    },
    error: (err) => console.error('Erro no login Google', err)
  });
  }

}
