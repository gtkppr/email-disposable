# Email Disposable

A regularly updated list of disposable and temporary email domains, ideal for validating user sign-ups, preventing spam, 
and filtering fake accounts.

## Installation

Via NPM:

```shell
npm install email-disposable
```

Via Yarn:

```shell
yarn add email-disposable
```

## Usage

Check if an email is disposable:

```javascript
import isDisposable from "email-disposable"

console.log(isDisposable("john@mailinator.com")) // true
console.log(isDisposable("john@0wnd.ro")) // true
console.log(isDisposable("john@gmail.com"))     // false
```

Get the full domain list:

```javascript
import { domainsList } from "email-disposable"

console.log(disposable.length) // 117000+
```

## Updates

This list combines multiple open-source sources to stay up-to-date with newly discovered disposable providers.

Use this command to get the latest domains:

```shell
npm run fetch
```

## Sources

- [disposable-email-domains/disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains)
- [TempMailDetector/Temporary-Email-Domain-Blocklist](https://github.com/TempMailDetector/Temporary-Email-Domain-Blocklist)
- [adamloving/temporary-email-address-domains](https://gist.github.com/adamloving/4401361)
- [jamesonev/disposableEmailDomains.txt](https://gist.github.com/jamesonev/7e188c35fd5ca754c970e3a1caf045ef/)
- [GeroldSetz/emailondeck.com-domains](https://github.com/GeroldSetz/emailondeck.com-domains)
- [disposable/static-disposable-lists](https://github.com/disposable/static-disposable-lists)
- [Propaganistas/Laravel-Disposable-Email](https://github.com/Propaganistas/Laravel-Disposable-Email)
- [wesbos/burner-email-providers](https://github.com/wesbos/burner-email-providers)
- [disposable/disposable-email-domains](https://github.com/disposable/disposable-email-domains)
- [unkn0w/disposable-email-domain-list](https://github.com/unkn0w/disposable-email-domain-list)
- [tompec/disposable-email-domains](https://github.com/tompec/disposable-email-domains)
- [flotwig/disposable-email-addresses](https://github.com/flotwig/disposable-email-addresses)
- [7c/fakefilter](https://github.com/7c/fakefilter)
- [daisy1754/jp-disposable-emails](https://github.com/daisy1754/jp-disposable-emails)
- [stopforumspam.com](https://www.stopforumspam.com/downloads/toxic_domains_whole.txt)
- [FGRibreau/mailchecker](https://github.com/FGRibreau/mailchecker)

## License

[MIT](https://opensource.org/license/mit) © 2025 [Gatekeepr](https://gatekeepr.ro).

## About

**email-disposable** is an open-source component of [Gatekeepr](https://gatekeepr.ro), a privacy-first API that blocks
fake users and platform abuse by analyzing emails, IPs, domains, and user agents in real time.






