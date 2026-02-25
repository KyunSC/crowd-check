import { Component, signal } from '@angular/core';
import { HomeButton } from '../../components/home-button/home-button';
import { FloorVotingPanel } from '../../components/floor-voting-panel/floor-voting-panel';
import { LIBRARIES, Library } from '../../data/library-data';

@Component({
  selector: 'app-library-selector',
  imports: [HomeButton, FloorVotingPanel],
  templateUrl: './library-selector.html',
  styleUrl: './library-selector.css',
})
export class LibrarySelector {
  libraries: Library[] = LIBRARIES;
  expandedLibraryId = signal<string | null>(null);
  expandedFloorKey = signal<string | null>(null);

  toggleLibrary(libraryId: string) {
    if (this.expandedLibraryId() === libraryId) {
      this.expandedLibraryId.set(null);
      this.expandedFloorKey.set(null);
    } else {
      this.expandedLibraryId.set(libraryId);
      this.expandedFloorKey.set(null);
    }
  }

  toggleFloor(libraryId: string, floorId: string) {
    const key = `${libraryId}-${floorId}`;
    this.expandedFloorKey.set(this.expandedFloorKey() === key ? null : key);
  }

  isLibraryOpen(libraryId: string): boolean {
    return this.expandedLibraryId() === libraryId;
  }

  isFloorOpen(libraryId: string, floorId: string): boolean {
    return this.expandedFloorKey() === `${libraryId}-${floorId}`;
  }
}
