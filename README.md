# nexrender-action-template-unzip

## Install

`npm install nexrender-action-template-unzip@latest`

## How to use

1. Send .ZIP file as the source instead of AE project in the `template.src` value
2. Add this module in pre-render actions, no parameters needed


```json
{
    "template": {
            "src": "https://example.com/ae-template-in-the.zip",
            "composition": "my_composition"
        },
    "assets": [],
    "actions": {
        "prerender": [
            {
                "module": "nexrender-action-template-unzip"
            }
        ]
    }
}

```

## Notes

* If source extensions is not a .ZIP, then any action will be skipped - safe to use with mixed content
* If the ZIP does NOT contain any .aep file, `reject` will be returned with an error message
* If there are multiple .aep files, the first found will be used (keep things tidy and don't use multiple .aep files inside a ZIP)
* If action is used in POST-render, `reject` will be returned with an error message
* If using multiple pre-render actions - might need to put this as a first


## Changes:

* 0.0.2 - Fix bug unzip not working when link is not http/s
* 0.0.3 - Use central logger instance
* 1.0.3 - Version bump to keep semver happy
* 1.0.4
  * Use console as logger fallback
  * Added testing with Jest
  * Bump adm-zip dependency version
* 1.1.0 - Feature - ignore AE auto save .aep files when looking for template
