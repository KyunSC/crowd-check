import { Component } from '@angular/core';
import { HomeButton } from '../../components/home-button/home-button';
import { VoteButton } from '../../components/vote-button/vote-button';

@Component({
  selector: 'app-library-page',
  imports: [HomeButton, VoteButton],
  templateUrl: './library-page.html',
  styleUrl: './library-page.css',
})
export class LibraryPage {

}
