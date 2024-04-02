// map.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }
  path = "https://localhost:7081";
  savePoint(point: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.path + '/save-point', point, {headers});
  }

  getPoints(): Observable<any[]> {
    return this.http.get<any[]>(this.path +'/points');
  }

  deletePoint(point: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete<any>(this.path + '/delete-point/'+ point);
  }
}
