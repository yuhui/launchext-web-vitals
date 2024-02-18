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

const mockBatch = require('../../specHelpers/mockBatch');
const mockTurbine = require('../../specHelpers/mockTurbine');

describe('clearBatch action delegate', function() {
  beforeEach(function() {
    this.batch = mockBatch();
    this.turbine = mockTurbine();

    this.actionDelegate = proxyquire(
      '../../../src/lib/actions/clearBatch',
      {
        '../controllers/batch': this.batch,
        '../controllers/turbine': this.turbine,
      }
    );
  });

  it('executes to completion', function() {
    this.actionDelegate();

    const { clear: clearBatch } = this.batch;
    expect(clearBatch).toHaveBeenCalledTimes(1);

    const { debug: logDebug } = this.turbine.logger;
    expect(logDebug).toHaveBeenCalledWith('Cleared the batch of Web Vitals metric reports.');
  });
});
