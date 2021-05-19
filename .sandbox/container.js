module.exports = {
  "extensions": {
    "web-vitals-js": {
      "displayName": "Web Vitals",
      "settings": {
        "reportAllChangesCLS": "yes",
        "reportAllChangesFCP": "no",
        "reportAllChangesFID": "no",
        "reportAllChangesLCP": "no",
        "reportAllChangesTTFB": "no"
      }
    }
  },
  "dataElements": {
    "Metric ID": {
      "settings": {},
      "cleanText": false,
      "forceLowerCase": false,
      "modulePath": "web-vitals-js/src/lib/dataElements/metricId.js",
      "storageDuration": ""
    },
    "Metric Name": {
      "settings": {},
      "cleanText": false,
      "forceLowerCase": false,
      "modulePath": "web-vitals-js/src/lib/dataElements/metricName.js",
      "storageDuration": ""
    },
    "Metric Delta": {
      "settings": {},
      "cleanText": false,
      "forceLowerCase": false,
      "modulePath": "web-vitals-js/src/lib/dataElements/metricDelta.js",
      "storageDuration": ""
    }
  },
  "rules": [{
    "id": "RL1621174335540",
    "name": "Cumulative Layout Shift (CLS), Largest Contentful Paint (LCP)",
    "events": [{
      "modulePath": "web-vitals-js/src/lib/events/cumulativeLayoutShift.js",
      "settings": {}
    }, {
      "modulePath": "web-vitals-js/src/lib/events/largestContentfulPaint.js",
      "settings": {}
    }],
    "actions": [{
      "modulePath": "sandbox/logEventInfo.js",
      "settings": {}
    }]
  }],
  "property": {
    "settings": {
      "domains": ["example.com"],
      "linkDelay": 100,
      "trackingCookieName": "sat_track",
      "undefinedVarsReturnEmpty": false
    }
  },
  "company": {
    "orgId": "ABCDEFGHIJKLMNOPQRSTUVWX@AdobeOrg"
  },
  "buildInfo": {
    "turbineVersion": "26.0.2",
    "turbineBuildDate": "2021-05-16T14:12:54.209Z",
    "buildDate": "2021-05-16T14:12:54.209Z",
    "environment": "development"
  }
}