/**
 * Copyright 2021 Yuhui. All rights reserved.
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

describe('metricId data element delegate', function() {
  var dataElementDelegate = require('../../../src/lib/dataElements/metricId');
  var getBaseEvent = require('../../specHelpers/getBaseEvent');

  beforeEach(function() {
    this.event = getBaseEvent();
    this.settings = {}; // this data element does not have any custom settings
  });

  describe('with invalid "event" argument', function() {
    it(
      'should be undefined when "webvitals" property is missing',
      function() {
        delete this.event.webvitals;
        var result = dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();
      }
    );

    it(
      'should be undefined when "id" property is missing',
      function() {
        delete this.event.webvitals.id;
        var result = dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();
      }
    );
  });

  describe('with valid "event" argument', function() {
    it(
      'should be a string',
      function() {
        var result = dataElementDelegate(this.settings, this.event);
        expect(result).toBeInstanceOf(String);
      }
    );
  });

});
