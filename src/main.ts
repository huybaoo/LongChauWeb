import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Cung cấp HttpClient
    ...appConfig.providers // Sử dụng provider từ appConfig
  ]
}).catch(err => console.error(err));
