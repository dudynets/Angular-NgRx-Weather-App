import { Component } from '@angular/core';
import {WeatherService} from "../weather.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  cities: string[];
  query: string;

  constructor(private weatherService: WeatherService, private router: Router) {
    this.cities = weatherService.getCities;
  }

  search(query) {
    this.router.navigate(
      ['/city', query]
    );
  }
}
