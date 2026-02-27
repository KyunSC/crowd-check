import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Dumbbell, BookOpen } from 'lucide-angular';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly Dumbbell = Dumbbell;
  readonly BookOpen = BookOpen;
}
