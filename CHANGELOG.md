# Changelog

## 2.0.0 - 2024-02-21

### Changed

- Updated bundled `web-vitals.attribution.js` library to version 3.5.2.
- Refactored code to improve modularisation and unit testing.

### Added

- Added new action: Clear Batch.
- Added new data elements: Batch.

## 1.4.3 - 2023-11-18

### Fixed

- Don't make the specific URL to be blank when re-opening the extension configuration after saving it.

### Changed

- Updated bundled `web-vitals.attribution.js` library to version 3.5.0.

## 1.4.2 - 2023-07-12

### Fixed

- Return `0` correctly for Metric Value and Metric Delta instead of `undefined`.

### Changed

- Updated bundled `web-vitals.attribution.js` library to version 3.3.2.

## 1.4.1 - 2023-04-21

### Fixed

- Fixed error in the configuration view that prevented the extension from being installed.
- Fixed error in the configuration view that prevented an own Web Vitals library URL to be saved.

## 1.4.0 - 2023-04-14

### Changed

- Updated bundled `web-vitals.attribution.js` library to version 3.3.1.
- Logged a warning if `event` argument is not provided to a data element that expects it.
- Refactored code to improve modularisation and unit testing.

### Added

- Added new data element: Rating Thresholds.

## 1.3.0 - 2022-11-29

### Changed

- Removed documentation of Web Vitals metrics values in favour of linking to the Web Vitals Github repository's README.

### Added

- Bundled `web-vitals.attribution.js` library version 3.1 library in the extension.
- Allow user to specify where to load the `web-vitals.js` library from: unpkg.com CDN, extension bundle, or own URL.
- Added error checks to validate Web Vitals events and metrics.

## 1.2.0 - 2022-09-29

### Fixed

- Fixed retrieving the value from a `coral-select` DOM element.

### Changed

- **Important:** Updated the extension runtime code to ES6 (since only modern browsers that support Web Vitals also support ES6).

### Added

- Added new event: Interaction to Next Paint.
- Added new data elements: Navigation Type, Rating, Attribution.

## 1.1.1 2021-09-21

### Changed

- Updated properties in `extension.json`.

## 1.1.0 - rejected by Adobe

## 1.0.1 - 2021-05-20

### Added

- Added missing data element: Metric Entries.

## 1.0.0 - 2021-05-19

### Added

- Load `web-vitals.js` library to measure Web Vitals.
- Detect Web Vitals as events: Cumulative Layout Shift, First Contentful Paint, First Input Delay, Largest Contentful Paint, Time to First Byte.
- Expose Web Vitals metrics as data elements: ID, name (and full name, which is specific to this extension not provided by Web Vitals itself), delta, value.
