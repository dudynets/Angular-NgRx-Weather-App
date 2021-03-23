import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { select, Store } from '@ngrx/store';
import { WeatherState } from '../reducers/weather/weather.reducer';
import { GetWeatherAction } from '../reducers/weather/weather.actions';
import { selectWeatherState } from '../reducers/weather/weather.selector';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {

  private city: string;
  private subscription: Subscription;
  loading = true;

  constructor(private activatedRoute: ActivatedRoute, private store$: Store<WeatherState>) {
    this.subscription = activatedRoute.params.subscribe(params => this.city = params['city']);
  }

  public weather$: Observable<WeatherState> = this.store$.pipe(
    select(selectWeatherState),
    tap(v => {
      console.log(v)
    })
  );

  ngOnInit(): void {
    this.store$.dispatch(new GetWeatherAction(this.city));
  }

  getIconUrl(code: string) {
    return `http://openweathermap.org/img/wn/${code}@2x.png`
  }
}
