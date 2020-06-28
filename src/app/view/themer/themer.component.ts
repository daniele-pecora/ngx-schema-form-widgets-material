import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Renderer2, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'

@Component({
  selector: 'app-themer',
  templateUrl: './themer.component.html',
  styleUrls: ['./themer.component.scss']
})
export class ThemerComponent implements OnInit {
  @Input("theme")
  themeId?: string

  @Input()
  waitBeforeSet?= 0

  @Input()
  waitBeforeOnLoad?= 0

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>()

  @Output()
  changeOnBefore: EventEmitter<string> = new EventEmitter<string>()


  @Output()
  onLayoutModeChange: EventEmitter<boolean> = new EventEmitter<boolean>()

  availableThemes: ThemeItem[] = themes

  selectedTheme: string

  constructor(private _renderer: Renderer2, @Inject(DOCUMENT) private _document: any) { }

  ngOnInit() {
  }
  /**
   * Theme
   */
  changeTheme(theme) {//alert('Sorry, not working yet :-(');return
    this.changeOnBefore.emit(this.selectedTheme)

    this.selectedTheme = theme
    setTimeout(() => {
      try {

        const themeLink: HTMLLinkElement = <HTMLLinkElement>this._document.getElementById('theme-css');
        const layoutLink: HTMLLinkElement = <HTMLLinkElement>this._document.getElementById('layout-css');
        if (themeLink)
          themeLink.href = 'assets/theme/theme-' + theme + '.css';
        if (layoutLink)
          layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';


      } catch (e) {
        console.error(e)
      }

      setTimeout(() => {
        this.change.emit(this.selectedTheme)
      }, this.waitBeforeOnLoad)

    }, this.waitBeforeSet)
  }
}

export interface ThemeItem {
  label: string
  icon?: string
  value: string
  primaryColor: string
  accentColor: string
  backgroudColor?: string
}

export const themes: ThemeItem[] = [
  { label: 'Indigo - Pink', icon: 'brush', value: 'indigo', primaryColor: '#283593', accentColor: '#E91E63', backgroudColor: '#FFFFFF' },
  { label: 'Brown - Green', icon: 'brush', value: 'brown', primaryColor: '#795548', accentColor: '#8BC34A', backgroudColor: '#FFFFFF' },
  { label: 'Blue - Amber', icon: 'brush', value: 'blue', primaryColor: '#03A9F4', accentColor: '#FFC107', backgroudColor: '#FFFFFF' },
  { label: 'Blue Grey - Green', icon: 'brush', value: 'blue-grey', primaryColor: '#607D8B', accentColor: '#8BC34A', backgroudColor: '#FFFFFF' },
  { label: 'Dark - Blue', icon: 'brush', value: 'dark-blue', primaryColor: '#3e464c', accentColor: '#5180ce', backgroudColor: '#FFFFFF' },
  { label: 'Dark - Green', icon: 'brush', value: 'dark-green', primaryColor: '#2f4050', accentColor: '#1ab394', backgroudColor: '#FFFFFF' },
  { label: 'Green - Yellow', icon: 'brush', value: 'green', primaryColor: '#4CAF50', accentColor: '#ffeb3b', backgroudColor: '#FFFFFF' },
  { label: 'Purple - Cyan', icon: 'brush', value: 'purple-cyan', primaryColor: '#673AB7', accentColor: '#00BCD4', backgroudColor: '#FFFFFF' },
  { label: 'Purple - Amber', icon: 'brush', value: 'purple-amber', primaryColor: '#673AB7', accentColor: '#FFC107', backgroudColor: '#FFFFFF' },
  { label: 'Teal - Lime', icon: 'brush', value: 'teal', primaryColor: '#009688', accentColor: '#CDDC39', backgroudColor: '#FFFFFF' },
  { label: 'Cyan - Amber', icon: 'brush', value: 'cyan', primaryColor: '#00bcd4', accentColor: '#ffc107', backgroudColor: '#FFFFFF' },
  { label: 'Grey - Deep Orange', icon: 'brush', value: 'grey', primaryColor: '#757575', accentColor: '#FF5722', backgroudColor: '#FFFFFF' },
]