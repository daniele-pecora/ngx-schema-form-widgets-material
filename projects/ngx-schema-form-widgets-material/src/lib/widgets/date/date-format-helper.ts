export class DateFormatHelper {
  /**
   * Here we care only of date numeric formats.<br/>
   * e.g. <code>12.12.2012</code> but not <code>March Thu 12 2012</code><br/>
   * TODO change this to https://github.com/MadMG/moment-jdateformatparser/blob/master/moment-jdateformatparser.js, but for poc this is sufficient
   */
  public static convertToFormatMomentJS(format: string) {
    if (format)
      return format
        .replace(/\bdd\b/g, 'DD')
        .replace(/\bMM\b/g, 'MM')
        .replace(/\byy\b/g, 'YYYY')
        .replace(/\byyyy\b/g, 'YYYY')
        .toUpperCase() // to upper for moment js format
    return format
  }

  /**
   * Here we care only of date numeric formats.<br/>
   */
  public static convertToFormatPrimeNG(format: string) {
    if (format)
      return format
        .replace(/\bDD\b/g, 'dd')
        .replace(/\bMM\b/g, 'mm')
        .replace(/\bYY\b/g, 'yy')
        .toLowerCase() // to upper for primeng js format
        .replace(/\byyyy\b/g, 'yy')
    return format
  }

}
