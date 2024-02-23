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

const mockTurbine = require('../../specHelpers/mockTurbine');

describe('turbine controller delegate', function () {
  beforeEach(function () {
    this.extensionSettings = {
      enableBatching: 'yes',
      webVitalsLibraryType: 'cdn',
      webVitalsLibraryUrl: 'default',
    };
    global.turbine = mockTurbine(this.extensionSettings, true);

    this.controllerDelegate = require('../../../src/lib/controllers/turbine');
  });

  afterEach(function () {
    delete global.turbine;
  });

  it('returns the expected object', function () {
    const result = this.controllerDelegate;

    expect(result).toBeDefined();

    const {
      enableBatching,
      getHostedLibFileUrl,
      logger,
      reportAllChanges,
      webVitalsLibrary,
    } = result;

    expect(enableBatching).toBeTrue();

    expect(getHostedLibFileUrl).toBeDefined();

    expect(logger).toBeDefined();

    expect(reportAllChanges).toBeDefined();

    const allChangesSettingsKeys = Object.keys(reportAllChanges);
    expect(allChangesSettingsKeys.length).toEqual(6);

    expect(reportAllChanges.CLS).toBeTrue();
    expect(reportAllChanges.FCP).toBeFalse();
    expect(reportAllChanges.FID).toBeTrue();
    expect(reportAllChanges.INP).toBeTrue();
    expect(reportAllChanges.LCP).toBeFalse();
    expect(reportAllChanges.TTFB).toBeTrue();

    expect(webVitalsLibrary).toBeDefined();
    expect(webVitalsLibrary.type).toEqual('CDN');
    expect(webVitalsLibrary.url).toEqual('default');
  });
});
