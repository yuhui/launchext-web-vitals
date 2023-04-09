/**
 * Copyright 2021-2022 Yuhui. All rights reserved.
 *
 * Licensed under the GNU General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const window = require('@adobe/reactor-window');
const loadScript = require('@adobe/reactor-load-script');

const logger = turbine.logger;
const toString = Object.prototype.toString;
const getWebVitalsMetricData = require('./getWebVitalsMetricData');
const processTriggers = require('./processTriggers');

// constants related to Web Vitals metrics
const CLS = 'CLS';
const FCP = 'FCP';
const FID = 'FID';
const INP = 'INP';
const LCP = 'LCP';
const TTFB = 'TTFB';

// map of Web Vitals metrics and their full names
const WEB_VITALS_METRICS = new Map([
  [CLS, 'Cumulative Layout Shift'],
  [FCP, 'First Contentful Paint'],
  [FID, 'First Input Delay'],
  [INP, 'Interaction to Next Paint'],
  [LCP, 'Largest Contentful Paint'],
  [TTFB, 'Time to First Byte'],
]);

// constants related to setting up Web Vitals
const WEB_VITALS_LIBRARY_TYPES = [
  'bundle',
  'cdn',
  'url',
];
const WEB_VITALS_CDN_MAJOR_VERSION = '3.1';
const WEB_VITALS_CDN_URL = `https://unpkg.com/web-vitals@${WEB_VITALS_CDN_MAJOR_VERSION}/dist/web-vitals.attribution.iife.js`;
const WEB_VITALS_VENDOR_SCRIPT_FILENAME = 'web-vitals.attribution.iife.js';

// constants related to this Extension's settings
const EXTENSION_SETTINGS = turbine.getExtensionSettings();

/**
 * Create the registry of all WebVitals metric events.
 * Every registered event has a list of triggers, where one trigger corresponds to one Tags Rule.
 */
const registry = {};
/**

/**
 * Used by Web Vitals callback functions after a metric has been measured.
 *
 * @param {String} webVitalsMetricAbbreviation The Web Vitals metric abbreviation.
 * @param {Object} data Data measured for the Web Vitals metric.
 */
const triggerWebVitalsMetric = (webVitalsMetricAbbreviation, data) => {
  let webVitalsMetric;
  switch (webVitalsMetricAbbreviation) {
    case 'CLS':
      webVitalsMetric = CUMULATIVE_LAYOUT_SHIFT;
      break;
    case 'FCP':
      webVitalsMetric = FIRST_CONTENTFUL_PAINT;
      break;
    case 'FID':
      webVitalsMetric = FIRST_INPUT_DELAY;
      break;
    case 'INP':
      webVitalsMetric = INTERACTION_TO_NEXT_PAINT;
      break;
    case 'LCP':
      webVitalsMetric = LARGEST_CONTENTFUL_PAINT;
      break;
    case 'TTFB':
      webVitalsMetric = TIME_TO_FIRST_BYTE;
      break;
  }
  processTriggers(webVitalsMetric, data);
};

/**
 * Callback function when Cumulative Layout Shift (CLS) has been measured.
 */
const triggerCLS = (data) => {
  triggerWebVitalsMetric('CLS', data);
};

/**
 * Callback function when First Contentful Paint (FCP) has been measured.
 */
const triggerFCP = (data) => {
  triggerWebVitalsMetric('FCP', data);
};

/**
 * Callback function when First Input Delay (FID) has been measured.
 */
const triggerFID = (data) => {
  triggerWebVitalsMetric('FID', data);
};

/**
 * Callback function when Interaction to Next Paint (INP) has been measured.
 */
const triggerINP = (data) => {
  triggerWebVitalsMetric('INP', data);
};

/**
 * Callback function when Largest Contentful Paint (LCP) has been measured.
 */
const triggerLCP = (data) => {
  triggerWebVitalsMetric('LCP', data);
};

/**
 * Callback function when Time to First Byte (TTFB) has been measured.
 */
const triggerTTFB = (data) => {
  triggerWebVitalsMetric('TTFB', data);
};

/**
 * Load the Web Vitals script asynchronously.
 * If successful, registers Web Vitals metric events to work with the Web Vitals metrics.
 * Returns with an error log if the script could not be loaded.
 *
 * @param {Object} settings The configuration settings object.
 * @param {Number} settings.durationThresholdINP=40 Duration threshold for INP.
 * @param {String} settings.reportAllChangesCLS=no Whether to report all CLS changes.
 * @param {String} settings.reportAllChangesFCP=no Whether to report all FCP changes.
 * @param {String} settings.reportAllChangesFID=no Whether to report all FID changes.
 * @param {String} settings.reportAllChangesINP=yes Whether to report all INP changes.
 * @param {String} settings.reportAllChangesLCP=no Whether to report all LCP changes.
 * @param {String} settings.reportAllChangesTTFB=no Whether to report all TTFB changes.
 * @param {String} settings.webVitalsLibraryType=cdn Where to load web-vitals.js from.
 * @param {String} settings.webVitalsLibraryUrl=default URL to load web-vitals.js.
 */
const loadWebVitals = function({
  durationThresholdINP = 40,
  reportAllChangesCLS = 'no',
  reportAllChangesFCP = 'no',
  reportAllChangesFID = 'no',
  reportAllChangesINP = 'yes',
  reportAllChangesLCP = 'no',
  reportAllChangesTTFB = 'no',
  webVitalsLibraryType = 'cdn',
  webVitalsLibraryUrl = 'default',
}) {
  if (!WEB_VITALS_LIBRARY_TYPES.includes(webVitalsLibraryType)) {
    logger.error(`Unknown Web Vitals library type provided: "${webVitalsLibraryType}".`);
    return;
  }

  let webVitalsUrl = WEB_VITALS_CDN_URL;
  switch (webVitalsLibraryType) {
    case 'bundle':
      webVitalsUrl = turbine.getHostedLibFileUrl(WEB_VITALS_VENDOR_SCRIPT_FILENAME);
      break;
    case 'url':
      webVitalsUrl = webVitalsLibraryUrl;
      break;
  }
  if (!webVitalsUrl) {
    logger.error(`Invalid URL to load Web Vitals library from: "${webVitalsUrl}".`);
    return;
  }
  const webVitalsLibraryLocation = webVitalsLibraryType === 'bundle'
    ? 'this extension'
    : `"${webVitalsUrl}"`;

  loadScript(webVitalsUrl).then(() => {
    if (!window.webVitals) {
      logger.error(`Web Vitals could not be loaded from ${webVitalsLibraryLocation}.`);
      return;
    }

    logger.debug(`Web Vitals was loaded successfully from ${webVitalsLibraryLocation}.`);

    const {
      onCLS = null,
      onFCP = null,
      onFID = null,
      onINP = null,
      onLCP = null,
      onTTFB = null
    } = window.webVitals;
    const failedToLoadListeners = [];
    if (onCLS && toString.call(onCLS) === '[object Function]') {
      onCLS(triggerCLS, { reportAllChanges: reportAllChangesCLS === 'yes' });
    } else {
      failedToLoadListeners.push('onCLS');
    }
    if (onFCP && toString.call(onFCP) === '[object Function]') {
      onFCP(triggerFCP, { reportAllChanges: reportAllChangesFCP === 'yes' });
    } else {
      failedToLoadListeners.push('onFCP');
    }
    if (onFID && toString.call(onFID) === '[object Function]') {
      onFID(triggerFID, { reportAllChanges: reportAllChangesFID === 'yes' });
    } else {
      failedToLoadListeners.push('onFID');
    }
    if (onINP && toString.call(onINP) === '[object Function]') {
      onINP(triggerINP, {
        reportAllChanges: reportAllChangesINP === 'yes',
        durationThreshold: durationThresholdINP,
      });
    } else {
      failedToLoadListeners.push('onINP');
    }
    if (onLCP && toString.call(onLCP) === '[object Function]') {
      onLCP(triggerLCP, { reportAllChanges: reportAllChangesLCP === 'yes' });
    } else {
      failedToLoadListeners.push('onLCP');
    }
    if (onTTFB && toString.call(onTTFB) === '[object Function]') {
      onTTFB(triggerTTFB, { reportAllChanges: reportAllChangesTTFB === 'yes' });
    } else {
      failedToLoadListeners.push('onTTFB');
    }

    if (failedToLoadListeners.length > 0) {
      const failedToLoadListenersString = failedToLoadListeners.map((listener) => {
        return `"webVitals.${listener}()"`;
      }).join(', ');
      logger.warn(`${failedToLoadListenersString} could not be loaded.`);
    }
  }, () => {
    logger.error(`Web Vitals could not be loaded from ${webVitalsLibraryLocation}.`);
  });
};

loadWebVitals(EXTENSION_SETTINGS);

module.exports = {
  /**
   */

  /**
   * Register the Web Vitals metrics for triggering in Rules.
   *
   * @param {String} webVitalsMetricAbbreviation The Web Vitals metric abbreviation.
   * @param {Object} settings The event settings object.
   * @param {ruleTrigger} trigger The trigger callback.
   */
  registerEventStateTrigger: (webVitalsMetricAbbreviation, settings, trigger) => {
    registry[webVitalsMetricAbbreviation].push({
      settings,
      trigger,
    });
  },
};
