/**
 * Copyright 2021-2024 Yuhui. All rights reserved.
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
    warn: logWarn,
  },
} = require('../controllers/turbine');

/**
 * Name data element.
 * This data element returns the name of the metric (in acronym form).
 * This name is one of the following:
 * - 'CLS'
 * - 'FCP'
 * - 'FID'
 * - 'INP'
 * - 'LCP'
 * - 'TTFB'
 *
 * @param {Object} settings The data element settings object.
 * @param {Object} event The event that triggered the evaluation of the data element.
 * @param {Object} event.webvitals=null The event's data.
 *
 * @returns {String} The Web Vitals metric's name.
 */
module.exports = ({}, event = null) => {
  let name;
  try {
    name = getMetricData('name', event);
  } catch (e) {
    logWarn(e.message);
    return;
  }

  return name;
};
