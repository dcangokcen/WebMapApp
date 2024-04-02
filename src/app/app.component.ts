// app.component.ts
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private map!: L.Map;
  points: any[] = [];

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.initMap();
    this.loadPoints();
  }

  private initMap(): void {
    this.map = L.map('map').setView([41.0054632, 28.8473731], 10);

    const tiles = new L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      console.log(center.lat, center.lng);
    });
  }

  savePoint(): void {
    const center = this.map.getCenter();
    const datetime = new Date().toISOString();
    const point = { id:0 ,lat: center.lat.toString(), lng: center.lng.toString(), datetime };
    const jsonPoint = JSON.stringify(point);
    console.log(jsonPoint);
    this.mapService.savePoint(jsonPoint).subscribe(() => {
      this.loadPoints();
    });
  }

  loadPoints(): void {
    this.mapService.getPoints().subscribe((points) => {
      this.points = points;
      console.log(this.points)
    });
  }

  addMarkers(): void {
    this.points.forEach(point => {
      L.marker([point.lat, point.lng]).addTo(this.map);
    });
  }

  downloadJson(): void {
    const filename = 'points.json';
    const json = JSON.stringify(this.points);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }

  showMarker(lat: number, lng: number): void {
    const marker = L.marker([lat, lng]).addTo(this.map);
  }
  deletePoint(pointToDelete: any): void {
    const index = this.points.indexOf(pointToDelete);
    if (index !== -1) {
      this.points.splice(index, 1);
      this.mapService.deletePoint(pointToDelete.id).subscribe(() => {
        this.removeMarker(pointToDelete); 
      });
    }
  }

  removeMarker(point: any): void {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        const marker = layer as L.Marker;
        const markerLatLng = marker.getLatLng();
        if (markerLatLng.lat === point.lat && markerLatLng.lng === point.lng) {
          this.map.removeLayer(marker);
        }
      }
    });
  }
}