/*! *****************************************************************************
Copyright (c) 2019 Tangra Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************** */
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { isKnownView, registerElement } from "nativescript-angular/element-registry";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { MaskedTextValueAccessor } from "./masked-text-value-accessor";

if (!isKnownView("MaskedTextField")) {
    registerElement("MaskedTextField", () => require("../masked-text-field").MaskedTextField);
}

@NgModule({
    declarations: [
        MaskedTextValueAccessor
    ],
    providers: [],
    imports: [
        FormsModule,
        NativeScriptFormsModule
    ],
    exports: [
        FormsModule,
        MaskedTextValueAccessor
    ]
})
export class MaskedTextFieldModule {
}
