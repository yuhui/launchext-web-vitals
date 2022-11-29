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
  // mock turbine.logger
  global.turbine = global.turbine || {
    logger: jasmine.createSpyObj('', ['debug', 'info', 'warn', 'alert', 'error']),
  };

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

        const logError = global.turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('No metric attribution item provided.');
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

        const logWarn = global.turbine.logger.warn;
        expect(logWarn).toHaveBeenCalledWith('Web Vitals not available.');
      }
    );

    it(
      'should be undefined when "attribution" property is missing in "webvitals"',
      () => {
        delete this.event.webvitals.attribution;
        const result = dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();

        const logWarn = global.turbine.logger.warn;
        expect(logWarn).toHaveBeenCalledWith('Metric attribution not available.');
      }
    );

    it(
      'should be undefined when "metricAttributionItem" property is missing in "attribution"',
      () => {
        delete this.event.webvitals.attribution[this.settings.metricAttributionItem];
        const result = dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();

        const logWarn = global.turbine.logger.warn;
        expect(logWarn).toHaveBeenCalledWith(
          `Metric attribution item "${this.settings.metricAttributionItem}" not available.`
        );
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
