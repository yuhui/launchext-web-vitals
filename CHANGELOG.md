1.4.1 (released 21 April 2023)
------------------------------

- Fixed error in the configuration view that prevented the extension from being installed.
- Fixed error in the configuration view that prevented an own Web Vitals library URL to be saved.

1.4.0 (released 14 April 2023)
------------------------------

- Updated web-vitals.attribution.js library to version 3.3.1.
- Added data element: Rating Thresholds.
- Log a warning if `event` argument is not provided to a data element that expects it.
- Refactored code to improve modularisation and unit testing.

1.3.0 (released 29 November 2022)
---------------------------------

- Updated web-vitals.attribution.js library to version 3.1.
- Bundled web-vitals.attribution.js library in the extension.
- Allow user to specify where to load the web-vitals.js library from: unpkg.com CDN, extension bundle, or own URL.
- Added error checks to validate Web Vitals events and metrics.
- Removed documentation of Web Vitals metrics values in favour of linking to the Web Vitals Github repository's README.

1.2.0 (released 29 September 2022)
----------------------------------

- IMPORTANT! This version updates the extension runtime code to ES6 (since only modern browsers that support Web Vitals also support ES6).
- Updated web-vitals.attribution.js library to version 3.0.
- Added event: Interaction to Next Paint.
- Added data elements: Navigation Type, Rating, Attribution.
- Bundled Adobe Coral for faster loading of styles.
- Fixed `coral-select` value.
- Updated JavaScript code to conform with [Airbnb's style guide](https://github.com/airbnb/javascript).

1.1.1 (released 21 September 2021)
----------------------------------

- Updated views' styles to use [Adobe Coral 4.5.0](https://opensource.adobe.com/coral-spectrum/documentation/).
- Updated properties in extension.json.

1.1.0 (rejected by Adobe)
-------------------------

1.0.1 (released 20 May 2021)
----------------------------

- Added missing Metric Entries data element.

1.0.0 (released 19 May 2021)
----------------------------

- Loads web-vitals.js library to measure Web Vitals.
- Detects Web Vitals as events: Cumulative Layout Shift, First Contentful Paint, First Input Delay, Largest Contentful Paint, Time to First Byte.
- Exposes Web Vitals metrics as data elements: ID, name (and full name, which is specific to this extension not provided by Web Vitals itself), delta, value.
