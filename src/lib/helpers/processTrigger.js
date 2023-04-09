/**
 * Copyright 2023 Yuhui. All rights reserved.
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

const { logger } = turbine;

const createGetWebVitalsMetricEvent = require('./createGetWebVitalsMetricEvent');

/**
 * Run a trigger that had been registered with the specified Web Vitals metric.
 *
 * @param {Object} metricData=null Data about the current Web Vitals metric.
 * @param {Object} triggerData=null Data that had been set with the Tags Rule.
 * @param {ruleTrigger} triggerData.trigger The Tags Rule's trigger function.
 */
module.exports = (metricData = null, triggerData = null) => {
  if (!metricData) {
    logger.error('Web Vitals metric data not specified.');
    return;
  }

  if (!triggerData) {
    logger.error('Rule event not specified.');
    return;
  }
  const { trigger } = triggerData;
  if (!trigger) {
    logger.error('Rule event not specified.');
    return;
  }

  const getWebVitalsMetricEvent = createGetWebVitalsMetricEvent.bind(window);

  trigger(getWebVitalsMetricEvent(metricData));
};
