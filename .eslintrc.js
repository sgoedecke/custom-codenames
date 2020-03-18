module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "plugin:react/recommended",
        "airbnb"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
      "react/destructuring-assignment": "off",
      "no-console": "off",
      "react/jsx-filename-extension": "off",
      "react/prop-types": "off",
      "react/button-has-type": "off",
      "react/no-access-state-in-setstate": "off",
      "react/jsx-no-bind": "off",
      "react/no-array-index-key": "off",
      "max-len": "off",
      "prefer-destructuring": "off",
      "class-methods-use-this": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off"
    }
};
