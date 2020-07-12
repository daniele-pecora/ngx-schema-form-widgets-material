import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core'
import {marker} from './marker.image'
import {transform as proj_transform} from 'ol/proj'
import {HttpClient} from '@angular/common/http'
import {Subscription} from 'rxjs'
import {GeoLocationService} from './geo-location.service'

@Component({
  selector: 'ngx-ui-osm-view',
  templateUrl: './osm-view.component.html',
  styleUrls: ['./osm-view.component.css'],
  providers: [HttpClient, GeoLocationService]
})
export class OsmViewComponent implements OnInit, OnDestroy {
  @Input()
  geoReverseService = 'https://nominatim.openstreetmap.org/reverse?key=iTzWSiYpGxDvhATNtSrqx5gDcnMOkntL&format=json&addressdetails=1&lat={lat}&lon={lon}'

  @Input()
  width: string
  @Input()
  height: string

  @Input()
  latitude = 52.520008
  @Input()
  longitude = 13.404954

  @Input()
  latitudePointer = 52.520008
  @Input()
  longitudePointer = 13.404954

  @Input()
  showControlsZoom: boolean
  @Input()
  titleZoomIn = 'Zoom in'
  @Input()
  titleZoomOut = 'Zoom out'
  @Input()
  showControlsCurrentLocation: boolean
  @Input()
  titleCurrentLocation = 'Current location'

  @Input()
  showDebugInfo: boolean
  @Input()
  opacity = 1
  @Input()
  zoom = 14

  markerImage = marker

  reverseGeoSub: Subscription = null
  pointedAddress: string
  pointedAddressOrg: string
  position: any
  dirtyPosition

  @Output()
  addressChanged = new EventEmitter<OsmViewAddressModel>()

  constructor(private httpClient: HttpClient, private geoLocationService: GeoLocationService) {
  }

  ngOnInit() {
    if (this.showControlsCurrentLocation) {
      this.geoLocationService.getLocation().subscribe((position) => {
        this.position = position
        if (!this.dirtyPosition) {
          this.dirtyPosition = true
          this.longitude = this.longitudePointer = this.position.coords.longitude
          this.latitude = this.latitudePointer = this.position.coords.latitude
        }
      })
    }
  }

  ngOnDestroy() {
    if (this.reverseGeoSub) {
      this.reverseGeoSub.unsubscribe()
    }
  }

  onSingleClick(event) {
    const lonlat = proj_transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
    this.longitudePointer = lonlat[0]
    this.latitudePointer = lonlat[1]
    this.reverseGeo()
  }

  increaseOpacity() {
    this.opacity += 0.1
  }

  decreaseOpacity() {
    this.opacity -= 0.1
  }

  increaseZoom() {
    this.zoom++
  }

  decreaseZoom() {
    this.zoom--
  }

  setCurrentLocation(event) {
    // TODO FIX: setting current location does move the pointer but not the map!!!
    if (this.position) {
      this.longitude = this.longitudePointer = this.position.coords.longitude
      this.latitude = this.latitudePointer = this.position.coords.latitude
      /**
       * Trigger new address change
       */
      this.reverseGeo()
    }
  }

  reverseGeo() {
    const service = (this.geoReverseService || '')
      .replace(new RegExp('{lon}', 'ig'), `${this.longitudePointer}`)
      .replace(new RegExp('{lat}', 'ig'), `${this.latitudePointer}`)
    this.reverseGeoSub = this.httpClient.get(service).subscribe(data => {
      const model = parseOSMAddress(data)
      const val = (data || {})
      this.pointedAddressOrg = val['display_name']
      this.pointedAddress = model.display

      this.addressChanged.emit(model)
    })
  }
}

export function parseOSMAddress(data): OsmViewAddressModel {
  const val = (data || {})

  const model: OsmViewAddressModel = {
    display: '',
    original: val,
    street: '',
    zip: '',
    city: '',
    building: '',
    house: '',
    lat: '',
    lon: '',
    country: '',
    country_code: ''
  }

  const address = []

  const building = []

  val['address'] = val['address'] || {}

  if (val['address']['building']) {
    building.push(val['address']['building'])
  }
  if (val['address']['mall']) {
    building.push(val['address']['mall'])
  }
  if (val['address']['theatre']) {
    building.push(val['address']['theatre'])
  }

  const zip_city = []
  if (val['address']['postcode']) {
    zip_city.push(val['address']['postcode'])
    model.zip = val['address']['postcode']
  }
  if (val['address']['city']) {
    zip_city.push(val['address']['city'])
    model.city = val['address']['city']
  }
  if (val['address']['town'] && !model.city) {
    zip_city.push(val['address']['town'])
    model.city = val['address']['town']
  }
  if (val['address']['village'] && !model.city) {
    zip_city.push(val['address']['village'])
    model.city = val['address']['village']
  }
  if (val['address']['suburb'] && !model.city) {
    zip_city.push(val['address']['suburb'])
    model.city = val['address']['suburb']
  }
  if (val['address']['neighbourhood'] && !model.city) {
    zip_city.push(val['address']['neighbourhood'])
    model.city = val['address']['neighbourhood']
  }

  const street_number = []
  if (val['address']['street']) {
    street_number.push(val['address']['street'])
  }
  if (val['address']['road']) {
    street_number.push(val['address']['road'])
  }
  if (val['address']['footway']) {
    street_number.push(val['address']['footway'])
  }
  if (val['address']['pedestrian']) {
    street_number.push(val['address']['pedestrian'])
  }
  if (street_number.length) {
    /** street without number */
    model.street = street_number.join(' ')
  }

  if (val['address']['house_number']) {
    street_number.push(val['address']['house_number'])
    /** only house number */
    model.house = val['address']['house_number']
  }

  if (building.length) {
    const _building = building.join(' ')
    model.building = _building
    address.push(_building)
  }

  if (zip_city.length) {
    address.push(zip_city.join(' '))
  }
  if (street_number.length) {
    address.push(street_number.join(' '))
  }

  model.lat = val['lat']
  model.lon = val['lon']
  model.country = val['address']['country']
  model.country_code = val['address']['country_code']

  model.display = address.join(', ')

  return model
}

export interface OsmViewAddressModel {
  display: string
  original: any
  street: string
  zip: string
  city: string
  building: string
  house: string
  lat: string
  lon: string
  country: string
  country_code: string
}
