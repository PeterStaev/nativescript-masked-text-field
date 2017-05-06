# NativeScript Masked Text Field widget 
[![Build Status](https://travis-ci.org/PeterStaev/nativescript-masked-text-field.svg?branch=master)](https://travis-ci.org/PeterStaev/nativescript-masked-text-field)
[![npm downloads](https://img.shields.io/npm/dm/nativescript-masked-text-field.svg)](https://www.npmjs.com/package/nativescript-masked-text-field)
[![npm downloads](https://img.shields.io/npm/dt/nativescript-masked-text-field.svg)](https://www.npmjs.com/package/nativescript-masked-text-field)
[![npm](https://img.shields.io/npm/v/nativescript-masked-text-field.svg)](https://www.npmjs.com/package/nativescript-masked-text-field)

A NativeScript Masked Text Field widget. The widget extends the default NativeScript TextField widget
and adds ability to define masks for the input. 

## Screenshot
![Screenshot of iOS and Android](https://raw.githubusercontent.com/PeterStaev/nativescript-masked-text-field/master/docs/screenshot.jpg)

## Installation
Run the following command from the root of your project:

`tns plugin add nativescript-masked-text-field`

This command automatically installs the necessary files, as well as stores nativescript-masked-text-field as a dependency in your project's `package.json` file.

## Usage
You need to add `xmlns:mtf="nativescript-masked-text-field"` to your page tag, and then simply use `<mtf:MaskedTextField/>` in order to add the widget to your page.

## API
NOTE: Since the widget extends the default TextFeild NatvieScript widget it has all the properties/events/methods of the TextField widget. The below-mentioned properties are in addition to the TextField ones

### Instance Properties
* **mask** - *string*  
Gets or sets the mask for the text field. Possible tokens in the mask:
  * `0` - Digit
  * `9` - Digit or space
  * `#` - Digit or `+` or `-`
  * `L` - ASCII Letter
  * `?` - ASCII Letter or space
  * `&` - Non-whitepsace character
  * `C` - Any charcter
  * `A` - ASCII Letter or digit
  * `a` - ASCII Letter or digit or space
  
  If you want to escape any token character you can use `\` (for example `\9`)


## Example
```XML
<!-- test-page.xml -->
<Page xmlns="http://schemas.nativescript.org/tns.xsd" xmlns:mtf="nativescript-masked-text-field">
    <StackLayout>
        <mtf:MaskedTextField text="{{ value }}" mask="(999) 999-9999" keyboardType="phone"/>
    </StackLayout>
</Page>
```

## Angular
TBD

## Working with Webpack+Uglify
In case you are uing webpack and also are minifying/uglifying your code, there are some specific names that should be excluded from the uglification for the widget to work properly. The MaskedTextField widget exports those and you need to add them to the mangle exclude option of the uglifyjs plugin in the `webpack.common.js` file:
```js
var maskedTextFieldMangleExcludes = require("nativescript-maskedTextField/uglify-mangle-excludes").default;
//......
module.exports = function (platform, destinationApp) {
    //......
    if (process.env.npm_config_uglify) {
        plugins.push(new webpack.LoaderOptionsPlugin({
            minimize: true
        }));

        //Work around an Android issue by setting compress = false
        var compress = platform !== "android";
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: nsWebpack.uglifyMangleExcludes.concat(maskedTextFieldMangleExcludes),
            },
            compress: compress,
        }));
    }
   //......
}
```
