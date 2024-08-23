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

const {
  WEB_VITALS_CDN_URL,
  WEB_VITALS_LIBRARY_TYPES,
  WEB_VITALS_VENDOR_SCRIPT_FILENAME,
} = require('../constants');
const {
  getHostedLibFileUrl,
  extensionSettings: {
    webVitalsLibraryType = 'cdn',
    webVitalsLibraryUrl = 'default',
  },
} = require('../controllers/turbine');

/**
 * Get the Web Vitals library's URL and location.
 *
 * @returns {String[]} [ Web Vitals URL, location ("this extension" or the URL itself)].
 *
 * @throws {Error} webVitalsLibraryType is not a recognised type.
 * @throws {Error} Web Vitals library URL is invalid.
 */
module.exports = () => {
  if (!WEB_VITALS_LIBRARY_TYPES.includes(webVitalsLibraryType)) {
    throw new Error(`Unknown Web Vitals library type provided: "${webVitalsLibraryType}"`);
  }

  let webVitalsUrl;
  switch (webVitalsLibraryType) {
    case 'bundle':
      webVitalsUrl = getHostedLibFileUrl(WEB_VITALS_VENDOR_SCRIPT_FILENAME);
      break;
    case 'cdn':
      webVitalsUrl = WEB_VITALS_CDN_URL;
      break;
    case 'url':
      webVitalsUrl = webVitalsLibraryUrl;
      break;
  }
  if (!webVitalsUrl || webVitalsUrl === 'default') {
    throw new Error('Web Vitals library URL is not set');
  }

  const webVitalsLocation = webVitalsLibraryType === 'bundle'
    ? 'this extension'
    : `"${webVitalsUrl}"`;

  return [ webVitalsUrl, webVitalsLocation ];
};
