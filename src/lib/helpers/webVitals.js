/**
 * Copyright 2021 Yuhui. All rights reserved.
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

var window = require('@adobe/reactor-window');
var loadScript = require('@adobe/reactor-load-script');

var logger = turbine.logger;

// constants related to Web Vitals metrics
var CUMULATIVE_LAYOUT_SHIFT = 'Cumulative Layout Shift';
var FIRST_CONTENTFUL_PAINT = 'First Contentful Paint';
var FIRST_INPUT_DELAY = 'First Input Delay';
var LARGEST_CONTENTFUL_PAINT = 'Largest Contentful Paint';
var TIME_TO_FIRST_BYTE = 'Time to First Byte';

// set of Web Vitals metrics
var WEB_VITALS_METRICS = [
  CUMULATIVE_LAYOUT_SHIFT,
  FIRST_CONTENTFUL_PAINT,
  FIRST_INPUT_DELAY,
  LARGEST_CONTENTFUL_PAINT,
  TIME_TO_FIRST_BYTE,
];

// constants related to setting up Web Vitals
var WEB_VITALS_URL = 'https://unpkg.com/web-vitals';

// constants related to this Extension's settings
var EXTENSION_SETTINGS = turbine.getExtensionSettings();

/**
 * Create the registry of all WebVitals metric events.
 * Every registered event has a list of triggers, where one trigger corresponds to one Launch Rule.
 */
var registry = {};
// use a for loop instead of forEach for efficiency
for (var i = 0, j = WEB_VITALS_METRICS.length; i < j; i++) {
  var webVitalsMetric = WEB_VITALS_METRICS[i];
  registry[webVitalsMetric] = [];
}

/**
 * Synthetic Web Vitals metric event to send to the trigger callback.
 * Should be bound to `window`.
 *
 * @param {DOMElement} element `window`.
 * @param {Object} metricData Data returned for the Web Vitals metric.
 * See `getWebVitalsMetrics()`.
 *
 * @return {Event} Event object that is specific to the Web Vitals metric.
 */
var createGetWebVitalsMetricEvent = function(element, metricData) {
  return {
    element: element,
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
var getWebVitalsMetricData = function(webVitalsMetric, data) {
  var metricData = {
    id: data.id,
    name: data.name,
    fullName: webVitalsMetric,
    delta: data.delta,
    value: data.value,
  };

  return metricData;
};

/**
 * Run a trigger that had been registered with the specified Web Vitals metric.
 *
 * @param {Object} metricData Data about the current Web Vitals metric.
 * @param {Object} triggerData Data that had been set with the Launch Rule.
 * See module.exports below.
 * @param {Object} triggerData.trigger The Launch Rule's trigger function.
 */
var processTrigger = function(metricData, triggerData) {
  var trigger = triggerData.trigger;
  var getWebVitalsMetricEvent = createGetWebVitalsMetricEvent.bind(window);

  trigger(getWebVitalsMetricEvent(window, metricData));
};

/**
 * When a Web Vitals metric has been measured, run all triggers registered with that metric.
 *
 * @param {string} webVitalsMetric The Web Vitals metric.
 * @param {Object} data Data measured for the Web Vitals metric.
 */
var processTriggers = function(webVitalsMetric, data) {
  var metricData = getWebVitalsMetricData(webVitalsMetric, data);

  var webVitalsMetricRegistry = registry[webVitalsMetric];
  // use a for loop instead of forEach for efficiency
  for (var i = 0, j = webVitalsMetricRegistry.length; i < j; i++) {
    var triggerData = webVitalsMetricRegistry[i];
    processTrigger(metricData, triggerData);
  }
};

/**
 * Callback function when Cumulative Layout Shift (CLS) has been measured.
 */
var triggerCLS = function(data) {
  logger.info('Web Vitals CLS measured.');
  processTriggers(CUMULATIVE_LAYOUT_SHIFT, data);
};

/**
 * Callback function when First Contentful Paint (FCP) has been measured.
 */
var triggerFCP = function(data) {
  logger.info('Web Vitals FCP measured.');
  processTriggers(FIRST_CONTENTFUL_PAINT, data);
};

/**
 * Callback function when First Input Delay (FID) has been measured.
 */
var triggerFID = function(data) {
  logger.info('Web Vitals FID measured.');
  processTriggers(FIRST_INPUT_DELAY, data);
};

/**
 * Callback function when Largest Contentful Paint (LCP) has been measured.
 */
var triggerLCP = function(data) {
  logger.info('Web Vitals LCP measured.');
  processTriggers(LARGEST_CONTENTFUL_PAINT, data);
};

/**
 * Callback function when Time to First Byte (TTFB) has been measured.
 */
var triggerTTFB = function(data) {
  logger.info('Web Vitals TTFB measured.');
  processTriggers(TIME_TO_FIRST_BYTE, data);
};

/**
 * Load the Web Vitals script asynchronously.
 * If successful, registers Web Vitals metric events to work with the Web Vitals metrics.
 * Returns with an error log if the script could not be loaded.
 */
var loadWebVitals = function(settings) {
  loadScript(WEB_VITALS_URL).then(function() {
    logger.info('Web Vitals was loaded successfully');

    webVitals.getCLS(triggerCLS, settings.reportAllChangesCLS === 'yes');
    webVitals.getFCP(triggerFCP, settings.reportAllChangesFCP === 'yes');
    webVitals.getFID(triggerFID, settings.reportAllChangesFID === 'yes');
    webVitals.getLCP(triggerLCP, settings.reportAllChangesLCP === 'yes');
    webVitals.getTTFB(triggerTTFB, settings.reportAllChangesTTFB === 'yes');
  }, function() {
    logger.error('Web Vitals could not be loaded');
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
  registerEventStateTrigger: function(webVitalsMetric, settings, trigger) {
    registry[webVitalsMetric].push({
      settings: settings,
      trigger: trigger
    });
  },
};
