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
  getExtensionSettings,
  getHostedLibFileUrl,
  logger,
} = turbine;

const { WEB_VITALS_METRICS } = require('../constants');

module.exports = {
  getHostedLibFileUrl,
  logger,

  get enableBatching() {
    const extensionSettings = getExtensionSettings();
    const { enableBatching } = extensionSettings;
    return enableBatching && enableBatching === 'yes';
  },

  get extensionSettings() {
    return getExtensionSettings();
  },

  get reportAllChanges() {
    const extensionSettings = getExtensionSettings();
    const reportAllChangesKeys = Object.keys(extensionSettings).filter((key) => {
      return key.startsWith('reportAllChanges');
    });
    const reportAllChanges = reportAllChangesKeys.reduce((obj, key) => {
      const metric = key.replace('reportAllChanges', '');
      if (!WEB_VITALS_METRICS.includes(metric)) {
        return obj;
      }

      const value = extensionSettings[key];
      const result = value && value === 'yes';
      return { ...obj, [metric]: result };
    }, {});
    return reportAllChanges;
  },

  get webVitalsLibrary() {
    const extensionSettings = getExtensionSettings();
    const { webVitalsLibraryType, webVitalsLibraryUrl } = extensionSettings;

    let type = 'CDN';
    switch (webVitalsLibraryType) {
      case 'bundle':
        type = webVitalsLibraryType;
        break;
      case 'cdn':
      case 'url':
        type = webVitalsLibraryType.toUpperCase();
        break;
    }

    let url = webVitalsLibraryUrl || 'default';

    return {
      type,
      url,
    };
  },
};
