import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// The shape of what the API sends back for GET /api/crowdedness/{id}
export interface CrowdednessResponse {
  locationId: string;
  locationName: string;
  level: number;      // 0 = unknown, 1 = not busy, 2 = moderate, 3 = packed
  voteCount: number;
}

// @Injectable makes this class available for dependency injection.
// providedIn: 'root' means one shared instance exists for the whole app
// (equivalent to AddSingleton on the .NET side).
@Injectable({ providedIn: 'root' })
export class CrowdednessService {
  private http = inject(HttpClient);
  private apiBase = environment.apiBase;

  // Returns an Observable — an async stream that emits the response when it arrives.
  // The component subscribes to it to get the value.
  getCrowdedness(locationId: string) {
    return this.http.get<CrowdednessResponse>(
      `${this.apiBase}/crowdedness/${locationId}`
    );
  }

  submitVote(locationId: string, level: number) {
    return this.http.post<{ message: string }>(
      `${this.apiBase}/crowdedness/${locationId}/vote`,
      { level }
    );
  }
}
