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

const proxyquire = require('proxyquire').noCallThru();

const mockController = require('../../specHelpers/mockController');
const mockTurbine = require('../../specHelpers/mockTurbine');

describe('batch data element delegate', function () {
  beforeEach(function () {
    this.controller = mockController();
    this.turbine = mockTurbine();
  });

  describe('with broken controller', function () {
    beforeEach(function () {
      this.controllerWithErrors = mockController('', {}, true);

      this.dataElementDelegate = proxyquire(
        '../../../src/lib/dataElements/batch',
        {
          '../controller': this.controllerWithErrors,
          '../controllers/turbine': this.turbine,
        }
      );
    });

    it('logs an error and returns nothing', function () {
      const result = this.dataElementDelegate();

      expect(result).toBeUndefined();

      const { error: logError } = this.turbine.logger;
      expect(logError).toHaveBeenCalled();
    });
  });

  describe('with everything working properly', function () {
    beforeEach(function () {
      this.dataElementDelegate = proxyquire(
        '../../../src/lib/dataElements/batch',
        {
          '../controller': this.controller,
          '../controllers/turbine': this.turbine,
        }
      );
    });

    it('is defined', function () {
      const result = this.dataElementDelegate();

      expect(result).toBeDefined();

      const { getBatch } = this.controller;
      expect(getBatch).toHaveBeenCalledTimes(1);

      const { debug: logDebug } = this.turbine.logger;
      expect(logDebug).toHaveBeenCalledWith('Batch of Web Vitals metric reports', result);
    });
  });
});
