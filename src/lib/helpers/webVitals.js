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
const WEB_VITALS_LIBRARY_TYPES = new Set([
  'bundle',
  'cdn',
  'url',
]);
const WEB_VITALS_CDN_MAJOR_VERSION = '3';
const WEB_VITALS_CDN_URL = `https://unpkg.com/web-vitals@${WEB_VITALS_CDN_MAJOR_VERSION}/dist/web-vitals.attribution.iife.js`;
const WEB_VITALS_VENDOR_SCRIPT_FILENAME = 'web-vitals.attribution.iife.js';

// constants related to this Extension's settings
const EXTENSION_SETTINGS = turbine.getExtensionSettings();

/**
 * Create the registry of all WebVitals metric events.
 * Every registered event has a list of triggers, where one trigger corresponds to one Tags Rule.
 */
const METRIC_TRIGGERS = new Map();
/**
 * Create the list of all WebVitals metric rating thresholds.
*/
const METRIC_RATING_THRESHOLDS = new Map();

/**
 * Used by Web Vitals callback functions after a metric has been measured.
 *
 * @param {Object} data Data measured for the Web Vitals metric.
 */
const triggerWebVitalsMetric = (data) => {
  const metric = data.name;

  if (!METRIC_TRIGGERS.has(metric)) {
    logger.debug(`No Rule events found for Web Vitals metric: ${metric}.`);
    return;
  }

  logger.debug(`${metric} measured.`);

  const metricFullName = WEB_VITALS_METRICS.get(metric) || metric;
  const metricData = getWebVitalsMetricData(data, metricFullName);

  const metricTriggerData = METRIC_TRIGGERS.get(metric);

  processTriggers(metricData, metricTriggerData);
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
const loadWebVitals = ({
  durationThresholdINP = 40,
  webVitalsLibraryType = 'cdn',
  webVitalsLibraryUrl = 'default',
  ...options
}) => {
  if (!WEB_VITALS_LIBRARY_TYPES.has(webVitalsLibraryType)) {
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

    const failedToLoadListeners = [];
    const reportAllChangesAcceptableValues = new Set(['no', 'yes']);
    let onMetric;
    let ratingThresholds;
    let reportAllChanges;
    let reportOptions;

    const metrics = WEB_VITALS_METRICS.keys();
    for (const metric of metrics) {
      onMetric = window.webVitals[`on${metric}`];
      if (onMetric && toString.call(onMetric) === '[object Function]') {
        reportOptions = {};

        reportAllChanges = options[`reportAllChanges${metric}`];
        if (!reportAllChangesAcceptableValues.has(reportAllChanges)) {
          reportAllChanges = metric === 'INP' ? 'yes' : 'no';
        }
        reportOptions.reportAllChanges = reportAllChanges === 'yes'

        if (metric === 'INP') {
          reportOptions.durationThreshold = durationThresholdINP;
        }

        onMetric(triggerWebVitalsMetric, reportOptions);
      } else {
        failedToLoadListeners.push(`on${metric}`);
      }
    };

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
   * @param {String} metric=null The Web Vitals metric.
   * @param {Object} settings={} The event settings object.
   * @param {ruleTrigger} trigger=null The trigger callback.
   */
  registerEventStateTrigger: (metric = null, settings = {}, trigger = null) => {
    if (!metric) {
      logger.error('Web Vitals metric not specified.');
      return;
    }
    if (!WEB_VITALS_METRICS.has(metric)) {
      logger.error(`Invalid Web Vitals metric specified: ${metric}.`);
      return;
    }
    if (!trigger) {
      logger.error('Rule event not specified.');
      return;
    }

    if (!METRIC_TRIGGERS.has(metric)) {
      METRIC_TRIGGERS.set(metric, []);
    }
    const metricTriggers = METRIC_TRIGGERS.get(metric);
    metricTriggers.push({
      settings,
      trigger,
    });
  },
};
