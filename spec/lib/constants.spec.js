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

const EXPECTED_CONSTANTS = {
  CDN_MAJOR_VERSION: '4',
  DEPRECATED_METRICS: [
    'FID',
  ],
  LIBRARY_TYPES: [
    'bundle',
    'cdn',
    'url',
  ],
  METRICS_NAMES: {
    CLS: 'Cumulative Layout Shift',
    FCP: 'First Contentful Paint',
    FID: 'First Input Delay',
    INP: 'Interaction to Next Paint',
    LCP: 'Largest Contentful Paint',
    TTFB: 'Time to First Byte',
  },
  VENDOR_SCRIPT_FILENAME: 'web-vitals.attribution.iife.js',
};

describe('constants delegate', function () {
  beforeEach(function () {
    this.delegate = require('../../src/lib/constants');
  });

  it('has the expected constants', function () {
    const result = this.delegate;

    expect(result).toBeDefined();

    const numKeys = Object.keys(result).length;
    expect(numKeys).toEqual(6);

    const {
      DEPRECATED_WEB_VITALS_METRICS,
      WEB_VITALS_CDN_URL,
      WEB_VITALS_LIBRARY_TYPES,
      WEB_VITALS_METRICS,
      WEB_VITALS_METRICS_NAMES,
      WEB_VITALS_VENDOR_SCRIPT_FILENAME,
    } = result;
    expect(WEB_VITALS_CDN_URL).toEqual(
      `https://unpkg.com/web-vitals@${EXPECTED_CONSTANTS.CDN_MAJOR_VERSION}/dist/web-vitals.attribution.iife.js`
    );
    expect(DEPRECATED_WEB_VITALS_METRICS).toEqual(EXPECTED_CONSTANTS.DEPRECATED_METRICS);
    expect(WEB_VITALS_LIBRARY_TYPES).toEqual(EXPECTED_CONSTANTS.LIBRARY_TYPES);
    expect(WEB_VITALS_METRICS).toEqual(Object.keys(EXPECTED_CONSTANTS.METRICS_NAMES));
    expect(WEB_VITALS_METRICS_NAMES).toEqual(EXPECTED_CONSTANTS.METRICS_NAMES);
    expect(WEB_VITALS_VENDOR_SCRIPT_FILENAME).toEqual(EXPECTED_CONSTANTS.VENDOR_SCRIPT_FILENAME);
  });
});
