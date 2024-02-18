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

const validateMetric = require('../helpers/validateMetric');

/**
 * Create the registry of all WebVitals metric events.
 * Every registered event has a list of triggers, where one trigger corresponds to one Tags Rule.
 */
const EVENTS = new Map();

module.exports = {
  /**
   * Get the Rule events for the specified Web Vitals metric.
   *
   * @param {String} metric=null The Web Vitals metric.
   *
   * @returns {Object.<Object, ruleTrigger>[]} List of event settings and trigger callbacks for the
   *    Web Vitals metric. Returns an empty array if no events are found for this metric.
   * @returns {Object.Object} The event settings object.
   * @returns {Object.ruleTrigger} The trigger callback.
   *
   * @throws {Error} metric is not specified.
   * @throws {Error} metric is not a Web Vitals metric.
   */
  get: (metric = null) => {
    try {
      validateMetric(metric);
    } catch (e) {
      throw e;
    }

    const events = EVENTS.has(metric) ? EVENTS.get(metric) : [];

    return events;
  },

  /**
   * Register the Web Vitals metric event for triggering in Rules.
   *
   * @param {String} metric=null The Web Vitals metric.
   * @param {Object} settings={} The event settings object.
   * @param {ruleTrigger} trigger=null The trigger callback.
   *
   * @throws {Error} metric is not specified.
   * @throws {Error} metric is not a Web Vitals metric.
   */
  register: (metric = null, settings = {}, trigger = null) => {
    try {
      validateMetric(metric);
    } catch (e) {
      throw e;
    }

    if (!trigger) {
      throw new Error('Rule event not specified.');
    }

    if (!EVENTS.has(metric)) {
      EVENTS.set(metric, []);
    }
    const events = EVENTS.get(metric);
    events.push({
      settings,
      trigger,
    });
  },
};
