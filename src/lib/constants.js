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

const WEB_VITALS_CDN_MAJOR_VERSION = '3';

const WEB_VITALS_LIBRARY_TYPES = [
  'bundle',
  'cdn',
  'url',
];

// map of Web Vitals metrics and their full names
const WEB_VITALS_METRICS_NAMES = {
  CLS: 'Cumulative Layout Shift',
  FCP: 'First Contentful Paint',
  FID: 'First Input Delay',
  INP: 'Interaction to Next Paint',
  LCP: 'Largest Contentful Paint',
  TTFB: 'Time to First Byte',
};

const DEPRECATED_WEB_VITALS_METRICS = [
  'FID',
];

const WEB_VITALS_VENDOR_SCRIPT_FILENAME = 'web-vitals.attribution.iife.js';

module.exports = {
  DEPRECATED_WEB_VITALS_METRICS,
  WEB_VITALS_LIBRARY_TYPES,
  WEB_VITALS_METRICS_NAMES,
  WEB_VITALS_VENDOR_SCRIPT_FILENAME,

  // set of Web Vitals metrics
  WEB_VITALS_METRICS: Object.keys(WEB_VITALS_METRICS_NAMES),

  // constants related to setting up Web Vitals
  WEB_VITALS_CDN_URL: `https://unpkg.com/web-vitals@${WEB_VITALS_CDN_MAJOR_VERSION}/dist/web-vitals.attribution.iife.js`,
};
