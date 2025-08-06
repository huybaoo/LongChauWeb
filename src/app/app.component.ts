// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Đảm bảo import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <router-outlet></router-outlet> <!-- Thêm outlet router ở đây -->
  `,
  imports: [
    RouterModule, // Đảm bảo RouterModule được import
    CommonModule // Import CommonModule để sử dụng pipe currency
    // Xóa HttpClientModule nếu không sử dụng
  ],
})
export class AppComponent {
  title = 'nhathuoclongchau11';
}
