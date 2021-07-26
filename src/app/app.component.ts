import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';

// services
import { WeatherService } from './core/weather.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  
  title: string = 'weather-app';

  latitude: number = 0
  longitude: number = 0
  zoom: number = 0
  address: string = ''
  items: any;

  currentWeather: any = {};
  forecastWeather: any = {};
  errorForecastWeather:any;

  private geoCoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private _mapsAPILoader: MapsAPILoader,
    private _weatherService: WeatherService,
    private ngZone: NgZone
  ) {}
	
  // set variable start date and stop date and range amount days
  initDates() {
    let startDate = new Date();
    var stopDate = new Date();
    stopDate.setDate(stopDate.getDate() + 3);
    let days = this.getDates(startDate, stopDate)
    return days
  }

  // set range days by start date and stop date
  getDates(start, end) {
    for(var arr=[] as any,dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
      let w = new Date(dt)
      arr.push(Math.floor(w.getTime() / 1000))
    }
    return arr;
  };

  ngOnInit() {
    // load map
    this._mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      // autocomplete search area around current map
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {

          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;

          this.getAddress(this.latitude, this.longitude);

        });
      });
    });
  }

  // get current location from API googlemap
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  // get address from API googlemap
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          let params = {"lat": latitude, "lon": longitude,"dt":"1627151442"}
          
		      this.getCurrentWeather(params)
          let days = this.initDates()
          this.getForecastNextDayWeather(days,latitude,longitude)

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    
    });
  }

  // get current location from https://openweathermap.org by observable services
	getCurrentWeather(params){
		this._weatherService.getCurrentWeather(params).subscribe((data) =>{
      this.currentWeather = JSON.parse(JSON.stringify(data))
    })
	}

  // get forecast location from https://openweathermap.org by observable services
  getForecastNextDayWeather(days,latitude,longitude) {
    this.items = []
    for (var val of days){
      let params = {"lat": latitude, "lon": longitude,"dt":val}
      this._weatherService.getForecastNextDayWeather(params).subscribe((item) =>{
        this.forecastWeather = JSON.parse(JSON.stringify(item))
        this.items.push(this.forecastWeather);
      }, (error) => {
        this.errorForecastWeather = error.error.message
      })
    }
  }
}
