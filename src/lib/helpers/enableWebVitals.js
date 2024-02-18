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

const loadWebVitals = require('./loadWebVitals');
const { WEB_VITALS_METRICS } = require('../constants');
const {
  extensionSettings: {
    durationThresholdINP = 40,
  },
  logger: {
    debug: logDebug,
    error: logError,
  },
  reportAllChanges,
} = require('../controllers/turbine');
const {
  metrics: {
    listen: listenForMetric,
  },
} = require('../controllers/webVitals');

// remember if this helper has run before
var runEnableStatus = 'not started';

/**
 * Enable the Web Vitals library.
 *
 * @async
 *
 * @throws {Error} error from loadWebVitals().
 */
module.exports = async () => {
  if (runEnableStatus !== 'not started') {
    return;
  }
  runEnableStatus = 'running';

  let webVitalsLocation;
  try {
    webVitalsLocation = await loadWebVitals();
  } catch (e) {
    logError(`${e.message}`);
    runEnableStatus = 'not started';
    return;
  }

  let metricReportAllChanges;
  let metricReportOptions;
  let metricsWithErrors = [];

  for (const metric of WEB_VITALS_METRICS) {
    metricReportAllChanges = reportAllChanges[metric] || false;
    metricReportOptions = {
      reportAllChanges: metricReportAllChanges,
    };

    if (metric === 'INP') {
      metricReportOptions.durationThreshold = durationThresholdINP;
    }

    try {
      listenForMetric(metric, metricReportOptions);
    } catch (e) {
      metricsWithErrors.push(metric);
    }
  }

  if (metricsWithErrors.length > 0) {
    logError(`Unable to get reports for Web Vitals metrics "${metricsWithErrors.join('", "')}".`);
    runEnableStatus = 'not started';
    return;
  }

  logDebug(`Web Vitals was loaded successfully from ${webVitalsLocation}.`);

  runEnableStatus = 'completed';
};
