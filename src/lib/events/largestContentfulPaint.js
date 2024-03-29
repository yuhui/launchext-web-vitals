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

const { handleEvent } = require('../controller');
const {
  logger: {
    error: logError,
  },
} = require('../controllers/turbine');

/**
 * Web Vitals Largest Contentful Paint metric event.
 * This event occurs at the point in the current page's load timeline when its main content has
 * likely loaded.
 *
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = (settings, trigger) => {
  try {
    handleEvent('LCP', settings, trigger);
  } catch (e) {
    logError(e.message);
  }
};
