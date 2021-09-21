1.1.1 (released 21 September 2021)
-----------------------------

- Updated views' styles to use [Adobe Coral 4.5.0](https://opensource.adobe.com/coral-spectrum/documentation/).
- Updated properties in extension.json.

1.1.0 (rejected by Adobe)
-------------------------

1.0.1 (released 20 May 2021)
-----------------------------

- Add missing Metric Entries data element.

1.0.0 (released 19 May 2021)
-----------------------------

- Loads webvitals.js library to measure WebVitals metrics.
- Detects WebVitals measurements as events: Cumulative Layout Shift, First Contentful Paint, First Input Delay, Largest Contentful Paint, Time to First Byte.
- Exposes WebVitals metrics as data elements: ID, name (and full name, which is specific to this extension not provided by WebVitals itself), delta, value.
