/*! *****************************************************************************
Copyright (c) 2017 Tangra Inc.
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
import { CoercibleProperty, Property } from "ui/core/view";
import { TextField } from "ui/text-field";

import { MaskedTextField as MaskedTextFieldDefinition } from ".";

export * from "ui/text-field";

export class MaskedTextFieldBase extends TextField implements MaskedTextFieldDefinition {
    public mask: string;
    public text: string;

    public _emptyMaskedValue: string = "";
    private _placeholder: string = "_";
    private _tokenRulesMap: { [key: string]: RegExp } = {
        "0": /\d/,
        "9": /\d|\s/,
        "#": /\d|\s|\+|\-/,
        "L": /[a-zA-Z]/,
        "?": /[a-zA-Z]|\s/,
        "&": /\S/,
        "C": /./,
        "A": /[a-zA-Z0-9]/,
        "a": /[a-zA-Z0-9]|\s/
    };
    private _maskTokens: Array<string | RegExp> = [];

    public _generateMaskTokens() {
        const maskChars = this.mask.split("");
        const emptyMaskedValueBuider: string[] = [];
        let isEscapeCharIn = false;

        this._maskTokens.length = 0;
        for (const char of maskChars) {
            if (isEscapeCharIn) {
                isEscapeCharIn = false;
                this._maskTokens.push(char);
                emptyMaskedValueBuider.push(char);
                continue;
            }

            if (char === "\\") {
                isEscapeCharIn = true;
                continue;
            }

            const tokenRule = this._tokenRulesMap[char];
            this._maskTokens.push(tokenRule || char);
            emptyMaskedValueBuider.push(tokenRule ? this._placeholder : char);
        }

        this._emptyMaskedValue = emptyMaskedValueBuider.join("");
    }

    public _getUnmaskedValue(value: any, startTokenIndex?: number) {
        if (!value) {
            return "";
        }

        const resultBuilder: string[] = [];
        const chars = value.toString().split("");
        let tokenLoop = startTokenIndex || 0;
        let charLoop = 0;

        while (tokenLoop < this._maskTokens.length && charLoop < chars.length) {
            const char = chars[charLoop];
            const token = this._maskTokens[tokenLoop];

            if (char === token || char === this._placeholder) {
                if (char === this._placeholder) {
                    resultBuilder.push(this._placeholder);
                }
                tokenLoop++;
                charLoop++;
                continue;
            }

            if (token instanceof RegExp) {
                if (token.test(char)) {
                    resultBuilder.push(char);
                    tokenLoop++;
                }
                charLoop++;
                continue;
            }

            tokenLoop++;
        }

        return resultBuilder.join("");
    }

    public _getNewMaskedValue(replaceStart: number, replaceEnd: number, replaceValue: string, isBackwardsIn?: boolean) {
        replaceStart = this._getFirstRegExpToken(replaceStart, isBackwardsIn);
        if (replaceStart > replaceEnd) {
            replaceEnd = replaceStart;
        }

        const currentValue = this.text || this._emptyMaskedValue;
        const unmaskedValueAndSuffix =
            this._getUnmaskedValue(replaceValue, replaceStart)
            + this._getUnmaskedValue(currentValue.substring(replaceEnd + 1), replaceEnd + 1);
        const unmaskedValueAndSuffixSplit = unmaskedValueAndSuffix.split("");
        const currentValueSplit = currentValue.split("");

        for (let loop = replaceStart, charLoop = 0; loop > -1 && loop < this._emptyMaskedValue.length; loop = this._getFirstRegExpToken(loop + 1), charLoop++) {
            currentValueSplit[loop] = unmaskedValueAndSuffixSplit[charLoop] || this._placeholder;
        }

        return currentValueSplit.join("");        
    }

    public _getFirstRegExpToken(start: number, isBackwardsIn?: boolean) {
        const step = (isBackwardsIn ? -1 : 1);

        for (let loop = start; loop > -1 && loop < this._maskTokens.length; loop += step) {
            if (this._maskTokens[loop] instanceof RegExp) {
                return loop;
            }
        }

        return -1;
    }
}

export const maskProperty = new Property<MaskedTextFieldBase, string>({
    name: "mask",
    defaultValue: "",
    valueChanged: (target, oldValue, newValue) => {
        target._generateMaskTokens();
    }
});
maskProperty.register(MaskedTextFieldBase);

export const textProperty = new CoercibleProperty<MaskedTextFieldBase, string>({
    name: "text",
    defaultValue: null,
    coerceValue: (target, value) => {
        console.log("coerce");
        if (!target._emptyMaskedValue) {
            return value;
        }

        const unmaskedValue = target._getUnmaskedValue(value);
        return target._getNewMaskedValue(0, target._emptyMaskedValue.length - 1, unmaskedValue);
    }
});
textProperty.register(MaskedTextFieldBase);