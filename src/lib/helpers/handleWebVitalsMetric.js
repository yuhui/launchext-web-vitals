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

const getWebVitalsMetricData = require('./getWebVitalsMetricData');
const processEvent = require('./processEvent');
const { append: appendToBatch } = require('../controllers/batch');
const { get: getEvents } = require('../controllers/events');

/**
 * Handle a Web Vitals metric report.
 *
 * @param {Object} data Data reported for the Web Vitals metric.
 *
 * @throws {Error} data is not specified.
 */
module.exports = (data = null) => {
  if (!data) {
    throw new Error('Web Vitals metric data not specified');
  }

  const { name: metric } = data;

  const events = getEvents(metric);

  const metricData = getWebVitalsMetricData(data);

  appendToBatch(metricData);

  if (events.length === 0) {
    // there are no Event triggers for this Web Vitals metric report, so ignore it
    return;
  }

  events.forEach((event) => {
    processEvent(metricData, event);
  });
};
