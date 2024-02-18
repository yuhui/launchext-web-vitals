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

const enableWebVitals = require('./enableWebVitals');
const validateMetric = require('./validateMetric');
const { register: registerEvent } = require('../controllers/events');

/**
 * Handle a Rule event.
 *
 * @async
 *
 * @param {String} metric=null The Web Vitals metric that the Rule event is for.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 *
 * @throws {Error} error from validateMetric().
 */
module.exports = async (metric = null, settings, trigger) => {
  try {
    validateMetric(metric);
  } catch (e) {
    throw e;
  }

  try {
    registerEvent(metric, settings, trigger);
  } catch (e) {
    throw e;
  }

  try {
    await enableWebVitals();
  } catch (e) {
    throw e;
  }
};
