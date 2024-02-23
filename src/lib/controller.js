/**
 * Copyright 2024 Yuhui. All rights reserved.
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

const {
  clear: clearBatch,
  get: getBatch,
} = require('./controllers/batch');
const { register: registerEvent } = require('./controllers/events');
const {
  enableBatching,
  logger: {
    error: logError,
  },
} = require('./controllers/turbine');
const enableWebVitals = require('./helpers/enableWebVitals');
const validateMetric = require('./helpers/validateMetric');

(async function () {
  try {
    enableWebVitals();
  } catch (e) {
    logError(e.message);
  };
})();

module.exports = {
  /**
   * Clear all Web Vitals metric reports from the batch.
   *
   * @throws {Error} Batching is not enabled.
   */
  clearBatch: () => {
    if (!enableBatching) {
      throw new Error('Batching has not been enabled. Check your extension settings.');
    }

    clearBatch();
  },

  /**
   * Get all of the currently collected Web Vitals metric reports from the batch.
   *
   * @throws {Error} Batching is not enabled.
   */
  getBatch: () => {
    if (!enableBatching) {
      throw new Error('Batching has not been enabled. Check your extension settings.');
    }

    const batch = getBatch();
    return batch;
  },

  /**
   * Get data from the selected Web Vitals metric report.
   *
   * @param {String} metricData Name of the metric data.
   * @param {Object} event The event that contains the Web Vitals metric report.
   * @param {Object} event.webvitals=null The Web Vitals metric report.
   *
   * @returns {*} Value of the specified Web Vitals metric data.
   *
   * @throws {Error} metricData is not set.
   * @throws {Error} event is not set.
   * @throws {Error} event.webvitals is not set.
   * @throws {Error} Value not set for the specified Web Vitals metric data.
   */
  getMetricData: (metricData, event = null) => {
    if (!metricData) {
      throw new Error('Web Vitals metric data not specified.');
    }

    if (!event) {
      throw new Error(
        '"event" argument not specified. Use _satellite.getVar("data element name", event);'
      );
    }

    const { webvitals = null } = event;
    if (!webvitals) {
      throw new Error('Web Vitals not available.');
    }

    const { [metricData]: data } = webvitals;
    if (typeof data === 'undefined') {
      throw new Error(`Metric "${metricData}" not available.`);
    }

    return data;
  },

  /**
   * Handle a Rule event.
   *
   * @async
   *
   * @param {String} metric=null The Web Vitals metric that the Rule event is for.
   * @param {Object} settings The event settings object.
   * @param {ruleTrigger} trigger The trigger callback.
   */
  handleEvent: async (metric = null, settings, trigger) => {
    validateMetric(metric);

    registerEvent(metric, settings, trigger);
  },
};
