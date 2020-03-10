const nodemailer = require("nodemailer");

class Email {
    /**
     *
     * @param {String} from
     * @param {String} to
     * @param {String} subject
     *
     * @param {String|Object} body
     * @param {string} body.text
     * @baram {string} body.html
     *
     * @param {String} transporter
     *
     * @param {Object} [options]
     *
     */
    constructor(from, to, subject, body, transporter, options = {}) {
        this.transporter = transporter;

        this.from = from;
        this.to = to;
        this.subject = subject;

        if (body instanceof Object) {
            this.text = body.text;
            this.html = body.html;
        } else {
            this.text = body;
        }

        this.cc = options.cc;
        this.bcc = options.bcc;
        this.attachments = options.attachments;
        this.sender = options.sender;
        this.replyTo = options.replyTo ;
        this.inReplyTo = options.inReplyTo;
        this.references = options.references;
        this.envelope = options.envelope;

        this.attachDataUrls = options.attachDataUrls;
        this.watchHtml = options.watchHtml;
        this.amp = options.amp;

        this.icalEvent = options.icalEvent;
        this.alternatives = options.alternatives;
        this.encoding = options.encoding;
        this.raw = options.raw;
        this.textEncoding = options.textEncoding;

        this.priority = options.priority;
        this.headers = options.headers;
        this.messageId = options.messageId;
        this.date = options.date;
        this.list = options.list;

        this.err = {};
        this.info = {};
        this.response = "";
    }

    send(callback) {
        let _config = config.getDataByID("email");
        let self = this;

        let transporter = nodemailer.createTransport(_config[self.transporter]);
        transporter.verify(function(err) {
            if (err) {
                self.err = err;
                callback(self);
            } else {
                transporter.sendMail(self, function(err, info, response) {
                    self.err = err;
                    self.info = info;
                    self.response = response;

                    callback(self);
                });
            }
        });
    }
}

module.exports = Email;
