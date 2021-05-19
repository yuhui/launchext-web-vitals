/**
 * Copyright 2021 Yuhui. All rights reserved.
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
 * Full Name data element.
 * This data element returns the full name of the metric.
 * This is NOT from the Web Vitals library, but is customised for this extension.
 * This name is one of the following:
 * - 'Cumulative Layout Shift'
 * - 'First Contentful Paint'
 * - 'First Input Delay'
 * - 'Time to First Byte'
 * - 'Largest Contentful Paint'
 *
 * @param {Object} settings The data element settings object.
 * @param {Object} event The event that triggered the evaluation of the data element.
 * @returns {String}
 */
module.exports = function(settings, event) {
  if (event && event.webvitals) {
    return event.webvitals.fullName;
  }
};
