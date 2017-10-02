if ((<any>global).TNS_WEBPACK) {
    //registers tns-core-modules UI framework modules
    require("bundle-entry-points");

    global.registerModule("nativescript-masked-text-field", () => require("nativescript-masked-text-field"));
    
    //register application modules
    global.registerModule("main-page", () => require("./main-page"));
}
