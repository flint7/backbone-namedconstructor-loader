'use strict';

var path = require('path');

function capitalise(str){
    str = str === null ? '' : String(str);
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function hasConstructor(source) {
    var matcher = /constructor\s*:/;
    return matcher.test(source);
}

function searchForClassToExtend(source) {
    var matcher = /([\w.]+).extend\({/;
    return source.match(matcher);
}

function splitSource(source, matchDetails) {
    var startOfClass = matchDetails.index + matchDetails[0].length;
    return [
        source.substring(0, startOfClass),
        source.substring(startOfClass)
    ];
}

function determineResourceName(resourcePath) {
    var fileName = path.basename(resourcePath, '.js');
    fileName = fileName.replace(/(-|\.)\S/g, function(c){ return c.toUpperCase(); })
    fileName = fileName.replace(/-|\./g, '');
    return capitalise(fileName);
}

module.exports = function (source) {
    var matchDetails,
        sourceInParts,
        resourceName;

    this.cacheable();

    if (hasConstructor(source)) {
        return source;
    }

    matchDetails = searchForClassToExtend(source);
    if (matchDetails === null) {
        return source;
    }

    sourceInParts = splitSource(source, matchDetails);
    resourceName = determineResourceName(this.resourcePath);

    var constructorAsString = '\n\n    constructor: function ' + resourceName + '() {\n' +
        '        ' + matchDetails[1] + '.prototype.constructor.apply(this, arguments);\n' +
        '    },';

    return sourceInParts[0] + constructorAsString + sourceInParts[1];
};
