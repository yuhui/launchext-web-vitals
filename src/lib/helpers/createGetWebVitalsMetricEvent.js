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

/**
 * Synthetic Web Vitals metric event to send to the trigger callback.
 *
 * @param {Object} metricData=null Data returned for the Web Vitals metric.
 *
 * @return {Object} Event object that is specific to the Web Vitals metric.
 */
module.exports = (metricData = null) => {
  if (!metricData) {
    logger.error('Web Vitals metric data not specified.');
    return;
  }

  return {
    window,
    target: window,
    webvitals: metricData,
  };
};
