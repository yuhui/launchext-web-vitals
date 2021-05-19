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

/**
 * Return a base `event` object for use with data element unit testing.
 */
module.exports = function() {
  var baseEvent = {
    webvitals: {
      id: 'v1-1621390039209-9647315286660',
      name: 'FCP',
      fullName: 'Full Contentful Paint',
      delta: 866.8799999868497,
      value: 2125.6949999951757,
    },
  };

  return baseEvent;
};
