import { Component, signal } from '@angular/core';
import { HomeButton } from '../../components/home-button/home-button';
import { VoteButton } from '../../components/vote-button/vote-button';
import { CrowdMeter } from '../../components/crowd-meter/crowd-meter';

@Component({
  selector: 'app-library-page',
  imports: [HomeButton, VoteButton, CrowdMeter],
  templateUrl: './library-page.html',
  styleUrl: './library-page.css',
})
export class LibraryPage {
  crowdLevel = signal(0);
}
