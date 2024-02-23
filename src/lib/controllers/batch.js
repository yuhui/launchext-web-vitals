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

/**
 * Create the batch of all Web Vitals metric reports.
*/
const REPORTS_BATCH = [];

module.exports = {
  /**
   * Append the reported Web Vitals metric data to the batch. The current timestamp will be
   * included with the metric data when appending.
   * Does not do anything if "enableBatching" extension setting is not "yes".
   *
   * @param {Object} metricData=null Data about the current Web Vitals metric.
   *
   * @throws {Error} metricData is not specified.
   */
  append: (metricData = null) => {
    if (!metricData) {
      throw new Error('Web Vitals metric data not specified.');
    }

    const timestamp = new Date().valueOf();
    const metricBatchData = { ...metricData, timestamp };

    REPORTS_BATCH.push(metricBatchData);
  },

  /**
   * Clear all Web Vitals metric reports from the batch.
   */
  clear: () => {
    REPORTS_BATCH.splice(0);
  },

  /**
   * Get all of the currently collected Web Vitals metric reports from the batch.
   * Does not do anything if "enableBatching" extension setting is not "yes".
   */
  get: () => {
    const batch = REPORTS_BATCH;
    return batch;
  },
};
