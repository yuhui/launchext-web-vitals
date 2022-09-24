/**
 * Copyright 2022 Yuhui. All rights reserved.
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

describe('metricAttribution data element delegate', () => {
  const dataElementDelegate = require('../../../src/lib/dataElements/metricAttribution');
  const getBaseEvent = require('../../specHelpers/getBaseEvent');

  beforeEach(() => {
    this.event = getBaseEvent();
    this.settings = {
      metricAttributionItem: 'loadState',
    };
  });

  describe('with invalid "settings" argument', () => {
    it(
      'should be undefined when "metricAttributionItem" property is missing',
      () => {
        delete this.settings.metricAttributionItem;
        const result = dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should be undefined when "metricAttributionItem" value is not found in "attribution"',
      () => {
        delete this.event.webvitals.attribution[this.settings.metricAttributionItem];
        const result = dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();
      }
    );
  });

  describe('with invalid "event" argument', () => {
    it(
      'should be undefined when "webvitals" property is missing',
      () => {
        delete this.event.webvitals;
        const result = dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should be undefined when "attribution" property is missing',
      () => {
        delete this.event.webvitals.attribution;
        const result = dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();
      }
    );
  });

  describe('with valid "event" argument', () => {
    it(
      'should be defined',
      () => {
        const result = dataElementDelegate(this.settings, this.event);
        expect(result).toBeDefined();
      }
    );
  });

});