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

describe('clearBatch action delegate', function () {
  beforeEach(function () {
    this.controller = mockController();
    this.turbine = mockTurbine();

    this.actionDelegate = proxyquire(
      '../../../src/lib/actions/clearBatch',
      {
        '../controller': this.controller,
        '../controllers/turbine': this.turbine,
      }
    );
  });

  it('executes to completion', function () {
    this.actionDelegate();

    const { clearBatch } = this.controller;
    expect(clearBatch).toHaveBeenCalledTimes(1);

    const { debug: logDebug } = this.turbine.logger;
    expect(logDebug).toHaveBeenCalledWith('Cleared the batch of Web Vitals metric reports.');
  });
});
