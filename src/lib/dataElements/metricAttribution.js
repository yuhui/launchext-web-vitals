/**
 * Copyright 2022 Yuhui. All rights reserved.
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
 * Attribution data element.
 * This data element returns the attribution of the metric.
 *
 * @param {Object} settings The data element settings object.
 * @param {String} settings.metricAttributionItem The selected attribution of the metric.
 * @param {Object} event The event that triggered the evaluation of the data element.
 * @param {Object} [event.webvitals=null] The event's data.
 * @returns {*}
 */
module.exports = function({ metricAttributionItem }, { webvitals = null }) {
  if (!webvitals) {
    return;
  }
  if (webvitals.attribution) {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    if (hasOwnProperty.call(webvitals.attribution, `${metricAttributionItem}`)) {
      return webvitals.attribution[metricAttributionItem];
    }
  }
};
