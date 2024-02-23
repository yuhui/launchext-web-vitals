/**
 * Copyright 2022-2024 Yuhui. All rights reserved.
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

const { getMetricData } = require('../controller');
const {
  logger: {
    error: logError,
    warn: logWarn,
  },
} = require('../controllers/turbine');

/**
 * Attribution data element.
 * This data element returns the attribution of the metric.
 *
 * @param {Object} settings The data element settings object.
 * @param {String} settings.metricAttributionItem=null The selected attribution of the metric.
 * @param {Object} event The event that triggered the evaluation of the data element.
 * @param {Object} event.webvitals=null The event's data.
 * @param {Object} event.webvitals.attribution=null The event's data metric attribution.
 *
 * @returns {*} The Web Vitals metric's attribution for the selected attribution.
 */
module.exports = ({ metricAttributionItem = null } = {}, event = null) => {
  if (!metricAttributionItem) {
    logError('No metric attribution item provided.');
    return;
  }

  let attribution;
  try {
    attribution = getMetricData('attribution', event);
  } catch (e) {
    logWarn(e.message);
    return;
  }

  const hasOwnProperty = Object.prototype.hasOwnProperty;
  if (!hasOwnProperty.call(attribution, `${metricAttributionItem}`)) {
    logWarn(`Metric attribution item "${metricAttributionItem}" not available.`);
    return;
  }

  return attribution[metricAttributionItem];
};
