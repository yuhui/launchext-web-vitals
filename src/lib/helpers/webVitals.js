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

// constants related to Web Vitals metrics
const CUMULATIVE_LAYOUT_SHIFT = 'Cumulative Layout Shift';
const FIRST_CONTENTFUL_PAINT = 'First Contentful Paint';
const FIRST_INPUT_DELAY = 'First Input Delay';
const INTERACTION_TO_NEXT_PAINT = 'Interaction to Next Paint';
const LARGEST_CONTENTFUL_PAINT = 'Largest Contentful Paint';
const TIME_TO_FIRST_BYTE = 'Time to First Byte';

// set of Web Vitals metrics
const WEB_VITALS_METRICS = [
  CUMULATIVE_LAYOUT_SHIFT,
  FIRST_CONTENTFUL_PAINT,
  FIRST_INPUT_DELAY,
  INTERACTION_TO_NEXT_PAINT,
  LARGEST_CONTENTFUL_PAINT,
  TIME_TO_FIRST_BYTE,
];

// constants related to setting up Web Vitals
const WEB_VITALS_MAJOR_VERSION = '3.0';
const WEB_VITALS_URL = `https://unpkg.com/web-vitals@${WEB_VITALS_MAJOR_VERSION}/dist/web-vitals.attribution.iife.js`;

// constants related to this Extension's settings
const EXTENSION_SETTINGS = turbine.getExtensionSettings();

/**
 * Create the registry of all WebVitals metric events.
 * Every registered event has a list of triggers, where one trigger corresponds to one Launch Rule.
 */
const registry = {};
WEB_VITALS_METRICS.forEach((webVitalsMetric) => {
  registry[webVitalsMetric] = [];
});

/**
 * Synthetic Web Vitals metric event to send to the trigger callback.
 * Should be bound to `window`.
 *
 * @param {DOMElement} element `window`.
 * @param {Object} metricData Data returned for the Web Vitals metric.
 * See `getWebVitalsMetrics()`.
 *
 * @return {Object} Event object that is specific to the Web Vitals metric.
 */
const createGetWebVitalsMetricEvent = (element, metricData) => {
  return {
    element,
    target: element,
    webvitals: metricData,
  };
};

/**
 * Get data for the current Web Vitals metric.
 *
 * @param {string} webVitalsMetric The Web Vitals metric.
 * @param {Object} data Data measured for the Web Vitals metric.
 *
 * @return {Object} Data about the current Web Vitals metric.
 */
const getWebVitalsMetricData = (webVitalsMetric, data) => {
  const metricData = Object.assign({}, data, { fullName: webVitalsMetric });

  return metricData;
};

/**
 * Run a trigger that had been registered with the specified Web Vitals metric.
 *
 * @param {Object} metricData Data about the current Web Vitals metric.
 * @param {Object} triggerData Data that had been set with the Launch Rule.
 * See module.exports below.
 * @param {ruleTrigger} triggerData.trigger The Launch Rule's trigger function.
 */
const processTrigger = (metricData, { trigger }) => {
  const getWebVitalsMetricEvent = createGetWebVitalsMetricEvent.bind(window);

  trigger(getWebVitalsMetricEvent(window, metricData));
};

/**
 * When a Web Vitals metric has been measured, run all triggers registered with that metric.
 *
 * @param {string} webVitalsMetric The Web Vitals metric.
 * @param {Object} data Data measured for the Web Vitals metric.
 */
const processTriggers = (webVitalsMetric, data) => {
  const metricData = getWebVitalsMetricData(webVitalsMetric, data);

  const webVitalsMetricTriggerData = registry[webVitalsMetric];
  webVitalsMetricTriggerData.forEach((triggerData) => {
    processTrigger(metricData, triggerData);
  });
};

/**
 * Callback function when Cumulative Layout Shift (CLS) has been measured.
 */
const triggerCLS = (data) => {
  logger.info('Web Vitals CLS measured.');
  processTriggers(CUMULATIVE_LAYOUT_SHIFT, data);
};

/**
 * Callback function when First Contentful Paint (FCP) has been measured.
 */
const triggerFCP = (data) => {
  logger.info('Web Vitals FCP measured.');
  processTriggers(FIRST_CONTENTFUL_PAINT, data);
};

/**
 * Callback function when First Input Delay (FID) has been measured.
 */
const triggerFID = (data) => {
  logger.info('Web Vitals FID measured.');
  processTriggers(FIRST_INPUT_DELAY, data);
};

/**
 * Callback function when Largest Contentful Paint (LCP) has been measured.
 */
const triggerLCP = (data) => {
  logger.info('Web Vitals LCP measured.');
  processTriggers(LARGEST_CONTENTFUL_PAINT, data);
};

/**
 * Callback function when Time to First Byte (TTFB) has been measured.
 */
const triggerTTFB = (data) => {
  logger.info('Web Vitals TTFB measured.');
  processTriggers(TIME_TO_FIRST_BYTE, data);
};

/**
 * Load the Web Vitals script asynchronously.
 * If successful, registers Web Vitals metric events to work with the Web Vitals metrics.
 * Returns with an error log if the script could not be loaded.
 *
 * @param {Object} settings The configuration settings object.
 * @param {number} [settings.reportAllChangesCLS=no] Whether to report all CLS changes.
 * @param {number} [settings.reportAllChangesFCP=no] Whether to report all FCP changes.
 * @param {number} [settings.reportAllChangesFID=no] Whether to report all FID changes.
 * @param {number} [settings.reportAllChangesLCP=no] Whether to report all LCP changes.
 * @param {number} [settings.reportAllChangesTTFB=no] Whether to report all TTFB changes.
 */
const loadWebVitals = function({
  reportAllChangesCLS = 'no',
  reportAllChangesFCP = 'no',
  reportAllChangesFID = 'no',
  reportAllChangesLCP = 'no',
  reportAllChangesTTFB = 'no',
}) {
  loadScript(WEB_VITALS_URL).then(() => {
    if (!webVitals) {
      logger.error(
        'Web Vitals could not be loaded, possibly because web-vitals.js could not be found.'
      );
      return;
    }

    logger.info('Web Vitals was loaded successfully.');

    webVitals.onCLS(triggerCLS, { reportAllChanges: reportAllChangesCLS === 'yes' });
    webVitals.onFCP(triggerFCP, { reportAllChanges: reportAllChangesFCP === 'yes' });
    webVitals.onFID(triggerFID, { reportAllChanges: reportAllChangesFID === 'yes' });
    webVitals.onLCP(triggerLCP, { reportAllChanges: reportAllChangesLCP === 'yes' });
    webVitals.onTTFB(triggerTTFB, { reportAllChanges: reportAllChangesTTFB === 'yes' });
  }, () => {
    logger.error('Web Vitals could not be loaded.');
  });
};

loadWebVitals(EXTENSION_SETTINGS);

module.exports = {
  /**
   * WebVitals event states (exposed from constants)
   */
  cls: CUMULATIVE_LAYOUT_SHIFT,
  fid: FIRST_INPUT_DELAY,
  fcp: FIRST_CONTENTFUL_PAINT,
  lcp: LARGEST_CONTENTFUL_PAINT,
  ttfb: TIME_TO_FIRST_BYTE,

  /**
   * Register the Web Vitals metrics for triggering in Rules.
   *
   * @param {string} webVitalsMetric The Web Vitals metric.
   * @param {Object} settings The event settings object.
   * @param {ruleTrigger} trigger The trigger callback.
   */
  registerEventStateTrigger: (webVitalsMetric, settings, trigger) => {
    registry[webVitalsMetric].push({
      settings,
      trigger,
    });
  },
};
