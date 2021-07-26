
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

  currentWeather: any = {};
  icon: string = '';
  private geoCoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private _mapsAPILoader: MapsAPILoader,
    private _weatherService: WeatherService,
    private ngZone: NgZone
  ) {}
	
  // getDates(start, end) {
  //   for(var arr=[] as any,dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
      
  //     arr.push(new Date(dt).getTime() / 1000);
  //   }
  //   return arr;
  // };

  // addDays(date, days) {
  //   date.setDate(date.getDate() + days);
  //   return date;
  // }

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

          let params = {"lat": this.latitude, "lon": this.longitude,"dt":"1627151442"}
          
          // this.getForecastNextDayWeather(params)
		      this.getCurrentWeather(params)
          this.getAddress(this.latitude, this.longitude);

        });
      });
    });
  }

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

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          let params = {"lat": latitude, "lon": longitude,"dt":"1627151442"}
          
		      this.getCurrentWeather(params)
          
          // let startDate = new Date();
          // var stopDate = new Date();
          // stopDate.setDate(stopDate.getDate() + 7);
          // let days = this.getDates(startDate, stopDate)
          // this.getRangeDays(days, params)
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    
    });
  }

  // getRangeDays(days, params) {
  //   let array = [] as any;
  //   for (var char of days) {
  //     this.getForecastNextDayWeather(params)
  //   }
  // }

	getCurrentWeather(params){
		this._weatherService.getCurrentWeather(params).subscribe((data) =>{
      this.currentWeather = JSON.parse(JSON.stringify(data))
      // debugger
      this.icon = "http://openweathermap.org/img/wn/" + this.currentWeather.weather[0].icon + "@2x.png"
    })
	}

  // getForecastNextDayWeather(params) {
	// 	this._weatherService.getForecastNextDayWeather(params).subscribe(function(data){
  //     let x = data
  //     // debugger
  //   })
  // }
}
