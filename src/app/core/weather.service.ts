import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppApi } from '../../app.api'; // global variables

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  constructor(private _http: HttpClient) { }

  apiKey = AppApi.API_KEY_WEATHER;
  apiWeather = AppApi.API_WHEATHER;
  
  getCurrentWeather(params) {
    return this._http.get(this.apiWeather + 'weather?lat=' + params.lat + '&lon=' + params.lon + '&units=metric' + '&appid=' + this.apiKey )
  }

  getForecastNextDayWeather(params) {
    return this._http.get(this.apiWeather + 'onecall/timemachine?lat=' + params.lat + '&lon=' + params.lon + '&dt=' + params.dt +'&appid=' + this.apiKey )
  }
}
