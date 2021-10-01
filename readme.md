# Chassis Email
Nodemailer wrapper for the Chassis bootstrapper.

---
## Getting Started
To install the plugin run:
```console
npm install chassis-email
```
To enable the plugin, include the module in your code:
```javascript
const Email = require("chassis-email");
```
---
## Usage
*Example:*
```javascript
let emailBody = {
    text: "This is email text.",
    html: "<p>This is email text with <b>HTML</b></p>"
}
let options = {
    cc: "someone.else@somemail.com",
    replyTo: "another.email@mail.com"
}

var myEmail = new Email("me@myemail.com", "you@youremail.com", emailBody, "myTransporter", options);

myEmail.send(function(myEmail) {
    if (myEmail.err) {
        //handle error
    } else {
        //email success
    }
});
```

## Syntax
```javascript
new Email(to, from, body, transporter, options);
```
#### Parameters
* `to` *(string)* â€“ Email address to send to.
* `from` *(string)* â€“ Email address sent from.
* `body` *(string|object)* â€“ Email body contents as a string or object.
* `body.text` *(string)* â€“ Plain text body of email. **Optional**
* `body.html` *(string)* â€“ HTML body of email. **Optional**
* `transporter` *(string)* â€“ Email transporter.
* `options` *(object)* â€“ Object of optional parameters. **Optional**
#### Options 
* `cc` *(string|array)* â€“ Comma separated list or an array of recipients email addresses that will appear on the Cc: field. **Optional**
* `bcc` *(string|array)* â€“ Comma separated list or an array of recipients email addresses that will appear on the Bcc: field. **Optional**
* `attachments` *(array)* â€“ An array of attachment objects. **Optional**
* `sender` *(string)* â€“ An email address that will appear on the Sender: field (always prefer from if you’re not sure which one to use).
* `replyTo` *(string)* â€“ An email address that will appear on the Reply-To: field. **Optional**
* `inReplyTo` *(string)* â€“ The Message-ID this message is replying to. **Optional**
* `references` *(string|array)* â€“ Message-ID list. **Optional**
* `envelope` *(object)* â€“ SMTP envelope. **Optional**
* `attachDataUrls` *(boolean)* â€“ If true then convert data: images in the HTML content of this message to embedded attachments. **Optional**
* `watchHtml` *(object)* â€“ Apple Watch specific HTML version of the message. Latest watches have no problems rendering text/html content so watchHtml is most probably never seen by the recipient. **Optional**
* `amp` *(object)* â€“ AMP4EMAIL specific HTML version of the message, same usage as with text and html. **Optional**
* `icalEvent` *(object)* â€“ iCalendar event to use as an alternative. **Optional**
* `alternatives` *(object)* â€“ An array of alternative text contents (in addition to text and html parts). **Optional**
* `encoding` *(object)* â€“ Identifies encoding for text/html strings (defaults to ‘utf-8’, other values are ‘hex’ and ‘base64’). **Optional**
* `raw` *(object)* â€“ Existing MIME message to use instead of generating a new one. **Optional**
* `textEncoding` *(object)* â€“ Force content-transfer-encoding for text values (either quoted-printable or base64). By default the best option is detected (for lots of ascii use quoted-printable, otherwise base64). **Optional**
* `priority` *(object)* â€“ Sets message importance headers, either ‘high’, ‘normal’ (default) or ‘low’. **Optional**
* `headers` *(object)* â€“ An object or array of additional header fields (e.g. {“X-Key-Name”: “key value”} or [{key: “X-Key-Name”, value: “val1”}, {key: “X-Key-Name”, value: “val2”}]). **Optional**
* `messageId` *(object)* â€“ Message-Id value, random value will be generated if not set. **Optional**
* `date` *(object)* â€“ Date value, current UTC string will be used if not set. **Optional**
* `list` *(object)* â€“ Helper for setting List-* headers. **Optional**
#### Methods
* 'send(*callback*)' â€“ Sends email instance. Callback returns the email instance with the following additional parameters:
    * err  *(object)* â€“ Date value, current UTC string will be used if not set. **Optional**
    * info  *(object)* â€“ Date value, current UTC string will be used if not set. **Optional**
    * response  *(object)* â€“ Date value, current UTC string will be used if not set. **Optional**
