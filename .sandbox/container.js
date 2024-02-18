module.exports = {
  "extensions": {
    "web-vitals-js": {
      "displayName": "Web Vitals",
      "settings": {
        "webVitalsLibraryType": "bundle",
        "webVitalsLibraryUrl": "default",
        "reportAllChangesCLS": "yes",
        "reportAllChangesFCP": "no",
        "reportAllChangesFID": "no",
        "reportAllChangesINP": "yes",
        "reportAllChangesLCP": "no",
        "reportAllChangesTTFB": "no",
        "durationThresholdINP": 40,
        "enableBatching": "yes"
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
    },
    "Metric FID Rating Thresholds": {
      "settings": {
        "metric": "FID"
      },
      "cleanText": false,
      "forceLowerCase": false,
      "modulePath": "web-vitals-js/src/lib/dataElements/metricRatingThresholds.js",
      "storageDuration": ""
    },
    "Batch": {
      "settings": {},
      "cleanText": false,
      "forceLowerCase": false,
      "modulePath": "web-vitals-js/src/lib/dataElements/batch.js",
      "storageDuration": ""
    }
  },
  "rules": [{
    "id": "RL1621174335540",
    "name": "Cumulative Layout Shift (CLS), First Contentful Paint (FCP), First Input Delay (FID), Interaction to Next Paint (INP), Largest Contentful Paint (LCP), Time to First Byte (TTFB)",
    "events": [{
      "modulePath": "web-vitals-js/src/lib/events/cumulativeLayoutShift.js",
      "settings": {}
    }, {
      "modulePath": "web-vitals-js/src/lib/events/firstContentfulPaint.js",
      "settings": {}
    }, {
      "modulePath": "web-vitals-js/src/lib/events/firstInputDelay.js",
      "settings": {}
    }, {
      "modulePath": "web-vitals-js/src/lib/events/interactionToNextPaint.js",
      "settings": {}
    }, {
      "modulePath": "web-vitals-js/src/lib/events/largestContentfulPaint.js",
      "settings": {}
    }, {
      "modulePath": "web-vitals-js/src/lib/events/timeToFirstByte.js",
      "settings": {}
    }],
    "actions": [{
      "modulePath": "sandbox/logEventInfo.js",
      "settings": {}
    }]
  }, {
    "id": "RL1705938489614",
    "name": "Click",
    "events": [{
      "modulePath": "sandbox/click.js",
      "settings": {}
    }],
    "actions": [{
      "modulePath": "web-vitals-js/src/lib/actions/clearBatch.js",
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
  "environment": {
    "id": "EN00000000000000000000000000000000",
    "stage": "development"
  },
  "buildInfo": {
    "turbineVersion": "27.5.0",
    "turbineBuildDate": "2024-02-03T15:11:25.779Z",
    "buildDate": "2024-02-03T15:11:25.780Z",
    "environment": "development"
  }
}