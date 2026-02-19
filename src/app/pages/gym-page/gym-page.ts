import { Component } from '@angular/core';
import { HomeButton } from '../../components/home-button/home-button';
import { VoteButton } from '../../components/vote-button/vote-button';

@Component({
  selector: 'app-gym-page',
  imports: [HomeButton, VoteButton],
  templateUrl: './gym-page.html',
  styleUrl: './gym-page.css',
})
export class GymPage {

}
