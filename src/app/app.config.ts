import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LoginAdminComponent } from './login-admin/login-admin.component';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: FormsModule } // Cung cấp FormsModule
  ]
};