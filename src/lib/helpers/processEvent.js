/**
 * Copyright 2023-2024 Yuhui. All rights reserved.
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

const createGetWebVitalsMetricEvent = require('./createGetWebVitalsMetricEvent');

/**
 * Process a Rule event that had been registered with the specified Web Vitals metric.
 *
 * @param {Object} metricData=null Data about the current Web Vitals metric.
 * @param {Object} event=null Event that had been set with the Tags Rule.
 * @param {ruleTrigger} event.trigger The Tags Rule event's trigger function.
 *
 * @throws {Error} metricData is not specified.
 * @throws {Error} event is not specified.
 * @throws {Error} event.trigger is not specified.
 * @throws {Error} error from createGetWebVitalsMetricEvent().
 */
module.exports = (metricData = null, event = null) => {
  if (!metricData) {
    throw new Error('Web Vitals metric data not specified.');
  }

  if (!event) {
    throw new Error('Rule event not specified.');
  }
  const { trigger } = event;
  if (!trigger) {
    throw new Error('Rule event not specified.');
  }

  try {
    const getWebVitalsMetricEvent = createGetWebVitalsMetricEvent.bind(window);
    trigger(getWebVitalsMetricEvent(metricData));
  } catch (e) {
    throw e;
  }
};
