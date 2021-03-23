import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, switchMap} from "rxjs/operators";
import { Router } from '@angular/router';

export interface CityWeather {
  city: string,
  timezone: string,
  current: {
    desc: string,
    icon: string,
    datetime: Date,
    temp: number,
    pressure: number,
    humidity: number,
    uvi: number,
    clouds: number
  },
  daily: {
    desc: string,
    icon: string,
    datetime: Date,
    temp: number,
    pressure: number,
    humidity: number,
    uvi: number,
    clouds: number
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient, private router: Router) { }

  private WEATHER_URL: string = 'https://api.openweathermap.org/data/2.5/onecall';
  private GEOCODING_URL: string = 'http://api.openweathermap.org/geo/1.0/direct';
  private API_KEY = 'e43d0b2cecf081064da8dca138efb7d1';
  private EXCLUDE = 'minutely,hourly,alerts';
  private UNITS = 'metric';

  private CITIES = ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Donetsk', 'Zaporizhzhia', 'Lviv', 'Kryvyy Rih', 'Mykolaiv', 'Sevastopol', 'Luhansk', 'Vinnytsia', 'Simferopol', 'Poltava', 'Chernihiv', 'Kherson', 'Cherkasy', 'Khmelnytskyi', 'Zhytomyr', 'Chernivtsi', 'Sumy', 'Rivne', 'Ivano-Frankivsk', 'Kropyvnytskyi', 'Ternopil', 'Lutsk'];

  getCoordinates(query: string) {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', '1')
      .set('appid', this.API_KEY);
    return this.http.get(this.GEOCODING_URL, {params});
  }

  getWeatherData(city: string) {
    let correctCity: string;

    return this.getCoordinates(city)
      .pipe(
        map(data => {
          if (!data[0]) {
            this.router.navigate(['404'])
            throw new Error('City not found')
          }
          correctCity = data[0]["name"];
          let lat: string = data[0]["lat"];
          let lon: string = data[0]["lon"];
          return [city, lat, lon];
        }),
        map(coordinates => {
          return new HttpParams()
          .set('lat', coordinates[1])
          .set('lon', coordinates[2])
          .set('units', this.UNITS)
          .set('exclude', this.EXCLUDE)
          .set('appid', this.API_KEY);
        }),
        switchMap(params => {
          return this.http.get(this.WEATHER_URL, {params})
            .pipe(
              map(data => {
                console.log(data)
                let cityWeather: CityWeather = {
                  city: correctCity,
                  timezone: data['timezone'],
                  current: {
                    desc: data['current']['weather'][0]['main'],
                    icon: this.getWeatherIcon(data['current']['weather'][0]['icon']),
                    datetime: new Date(data['current']['dt'] * 1000),
                    temp: data['current']['temp'],
                    pressure: data['current']['pressure'],
                    humidity: data['current']['humidity'],
                    uvi: data['current']['uvi'],
                    clouds: data['current']['clouds']
                  },
                  daily: []
                }
                for (let dayWeather in data['daily']) {
                  let dayWeatherItem = data['daily'][dayWeather]
                  let formattedDayWeatherItem = {
                    desc: dayWeatherItem['weather'][0]['main'],
                    icon: this.getWeatherIcon(dayWeatherItem['weather'][0]['icon']),
                    datetime: new Date(dayWeatherItem['dt'] * 1000),
                    temp: dayWeatherItem['temp']['day'],
                    pressure: dayWeatherItem['pressure'],
                    humidity: dayWeatherItem['humidity'],
                    uvi: dayWeatherItem['uvi'],
                    clouds: dayWeatherItem['clouds']
                  }
                  cityWeather['daily'].push(formattedDayWeatherItem);
                }
                return cityWeather;
              })
            );
        })
      )
  }

  getWeatherIcon(code: string) {
    if (code == '11d' || code == '11n') {
      return 'fas fa-bolt'
    } else if (code == '09d' || code == '10d' || code == '13d' || code == '09n' || code == '10n' || code == '13n') {
      return 'fas fa-cloud-rain'
    } else if (code == '13d' || code == '13n') {
      return 'far fa-snowflake'
    } else if (code == '50d' || code == '50n') {
      return 'fas fa-smog'
    } else if (code == '01d' || code == '01n') {
      return 'fas fa-sun'
    } else if (code == '02d' || code == '02n' || code == '03d' || code == '03n' || code == '04d' || code == '04n') {
      return 'fas fa-cloud'
    } else {
      return 'fas fa-sun'
    }
  }

  get getCities() {
    return this.CITIES;
  }
}
