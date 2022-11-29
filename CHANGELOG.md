1.3.0 (released 29 November 2022)
---------------------------------

- Updated web-vitals.js library to version 3.1.
- Bundled web-vitals.js library in the extension.
- Allow user to specify where to load the web-vitals.js library from: unpkg.com CDN, extension bundle, or own URL.
- Added error checks to validate Web Vitals events and metrics.
- Removed documentation of Web Vitals metrics values in favour of linking to the Web Vitals Github repository's README.
- Updated Adobe Coral to version 4.15.7.

1.2.0 (released 29 September 2022)
----------------------------------

- IMPORTANT! This version updates the extension runtime code to ES6 (since only modern browsers that support Web Vitals also support ES6).
- Updated web-vitals.js library to version 3.0.
- Added Web Vital: Interaction to Next Paint.
- Added metrics: Navigation Type, Rating, Attribution.
- Bundled Adobe Coral 4.15.1 for faster loading of styles.
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

- Loads web-vitals.js library to measure Web Vitals metrics.
- Detects Web Vitals measurements as events: Cumulative Layout Shift, First Contentful Paint, First Input Delay, Largest Contentful Paint, Time to First Byte.
- Exposes Web Vitals metrics as data elements: ID, name (and full name, which is specific to this extension not provided by Web Vitals itself), delta, value.
