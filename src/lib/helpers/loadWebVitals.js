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

const loadScript = require('@adobe/reactor-load-script');

const getWebVitalsLibrary = require('./getWebVitalsLibrary');
const validateWebVitals = require('./validateWebVitals');

/**
 * Load the Web Vitals script asynchronously.
 *
 * @async
 *
 * @returns the location that the Web Vitals script was loaded from.
 *
 * @throws {Error} something went wrong when loading Web Vitals.
 * @throws {Error} error from getWebVitalsLibrary().
 * @throws {Error} error from validateWebVitals().
 */
module.exports = async () => {
  let webVitalsLibrary;
  try {
    webVitalsLibrary = getWebVitalsLibrary();
  } catch (e) {
    throw e;
  }
  const [ webVitalsUrl, webVitalsLocation ] = webVitalsLibrary;

  try {
    await loadScript(webVitalsUrl);
  } catch (e) {
    throw new Error(`Failed to load Web Vitals from ${webVitalsLocation}.`);
  }

  try {
    validateWebVitals();
  } catch (e) {
    throw e;
  }

  return webVitalsLocation;
};
