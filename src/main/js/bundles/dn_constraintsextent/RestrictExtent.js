/*
 * Copyright (C) 2019 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import geometryEngine from "esri/geometry/geometryEngine";
import * as jsonUtils from "esri/geometry/support/jsonUtils";

const _watch = Symbol("_watch");

export default class RestrictExtent {
    activate() {
        this._getView().then((view) => {
            const extentWatch = view.watch("extent", (extent) => {
                if (extent) {
                    extentWatch.remove();
                    this._oldExtent = this._getInitialExtent(view);
                    this._watchForExtentChange(view);
                }
            })
        });
    }

    deactivate() {
        this[_watch].remove();
    }

    _watchForExtentChange(view) {
        this[_watch] = view.watch("stationary", (stationary) => {
            if (!stationary) {
                return;
            }
            if (this._isExtentOutsideMaxExtentGeometry(view.extent)) {
                const oldExtent = this._oldExtent;
                if (!oldExtent) {
                    return;
                }
                view.goTo(oldExtent);
            } else {
                this._oldExtent = view.extent;
            }
        });
    }

    _isExtentOutsideMaxExtentGeometry(extent) {
        const maxExtentGeometry = this._getMaxExtentGeometry();
        if (!maxExtentGeometry) {
            return false;
        }
        return !geometryEngine.within(extent, maxExtentGeometry);
    }

    _getInitialExtent(view) {
        const maxExtentGeometry = this._getMaxExtentGeometry();
        if (!maxExtentGeometry) {
            return view.extent;
        }
        const within = geometryEngine.within(view.extent, maxExtentGeometry);
        if (within) {
            return view.extent;
        } else {
            return maxExtentGeometry;
        }
    }

    _getMaxExtentGeometry() {
        const maxExtentGeometry = jsonUtils.fromJSON(this._properties.maxExtentGeometry);
        if (!maxExtentGeometry) {
            return null;
        }
        return maxExtentGeometry.extent.expand(this._properties.expandValue);
    }

    _getView() {
        const mapWidgetModel = this._mapWidgetModel;
        return new Promise((resolve, reject) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                mapWidgetModel.watch("view", ({value: view}) => {
                    resolve(view);
                });
            }
        });
    }
}
