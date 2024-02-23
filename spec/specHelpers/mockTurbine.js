/**
 * Copyright 2023-2024 Yuhui. All rights reserved.
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
 * Return a `turbine` spy object.
 */
module.exports = function (extensionSettings = {}, isGlobal = false) {
  const turbineMethods = {
    getHostedLibFileUrl: 'https://www.foo.com/bar',
  };
  const turbineProperties = {
    logger: jasmine.createSpyObj(
      'logger',
      ['debug', 'info', 'warn', 'alert', 'error']
    ),
  };

  const durationThresholdSettings = {
    durationThresholdINP: 40,
  };

  const reportAllChanges = {
    CLS: true,
    FCP: false,
    FID: true,
    INP: true,
    LCP: false,
    TTFB: true,
    FOO: true, // fake metric
  };
  const reportAllChangesSettings = Object.keys(reportAllChanges).reduce((obj, key) => {
    const value = reportAllChanges[key] ? 'yes' : 'no';
    return { ...obj, [`reportAllChanges${key}`]: value };
  }, {});

  const allExtensionSettings = {
    ...extensionSettings,
    ...durationThresholdSettings,
    ...reportAllChangesSettings,
  };

  if (isGlobal) {
    turbineMethods.getExtensionSettings = allExtensionSettings;
  } else {
    const { enableBatching } = extensionSettings;
    turbineProperties.enableBatching = enableBatching && enableBatching === 'yes';

    // fake metrics get removed by the `turbine` controller
    delete reportAllChanges.FOO;
    delete allExtensionSettings.reportAllChangesFOO;

    turbineProperties.extensionSettings = allExtensionSettings;

    turbineProperties.reportAllChanges = reportAllChanges;
  }

  const turbine = jasmine.createSpyObj(
    'turbine',
    turbineMethods,
    turbineProperties
  );

  return turbine;
};
