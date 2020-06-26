# Internationalization Tool

This script was used to create English, French, Germany and Russian definitions based on standard Chinese-Simplified language definitions for Tag x00. The process has been done so this document is only used for archive and future reference.

This tool uses [Bing translator API](https://www.microsoft.com/en-us/translator/translatorapi.aspx) to translate text into another language. The subscription key has been omitted (obviously I am not so stupid) so the script won't run unless you input your own one.

This script first makes a copy of original Chinese definitions, then recursively traverses all `string` in that object, replaces each with translated text after a dedicated request to Bing Translator API. After all definition are processed, a `{language}.json` is created and definitions will be written into it.

The following expectations has been observed:

1. Since original definition may contain { } placeholders for runtime replacement, the script will split the original text with placeholders and **uses items of odd index to translate**. It should work most of time, but problems still occurs when placeholder is of even index. This can be fixed by refined algorithm like the one in `LocaleStore`. `navbar.welcome` and `pay.mission.needCheck` are examples of victim.

2. Sometimes the input can't be translated which would cause an exception. Under this circumstance (and other runtime exception) a `//TODO` will be written into the definition which can be fixed manually.

3. Sometimes network breaks and node crashes. It isn't handled for convenience.




