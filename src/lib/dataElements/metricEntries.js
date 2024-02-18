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

const {
  logger: {
    warn: logWarn,
  },
} = require('../controllers/turbine');

/**
 * Entries data element.
 * This data element returns an array of the performance entries used in the metric's value
 * calculation.
 *
 * @param {Object} settings The data element settings object.
 * @param {Object} event The event that triggered the evaluation of the data element.
 * @param {Object} event.webvitals=null The event's data.
 *
 * @returns {Array} The Web Vitals metric's performance entries.
 */
module.exports = ({}, event = null) => {
  if (!event) {
    logWarn('"event" argument not specified. Use _satellite.getVar("data element name", event);');
    return;
  }
  const { webvitals = null } = event;
  if (!webvitals) {
    logWarn('Web Vitals not available.');
    return;
  }
  const { entries = null } = webvitals;
  if (!entries) {
    logWarn('Metric entries not available.');
    return;
  }

  return entries;
};
