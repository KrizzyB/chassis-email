const nodemailer = require("nodemailer");
const Imap = require('imap');
const {simpleParser} = require('mailparser');
const logModule = "chassis-email";

class Email {
    /**
     *
     * @param {String} from
     * @param {String} to
     * @param {String} subject
     *
     * @param {String|Object} body
     * @param {string} [body.text]
     * @baram {string} [body.html]
     *
     * @param {Transporter} transporter
     *
     * @param {Object} [options]
     *
     */
    constructor(from, to, subject, body, transporter, options = {}) {
        this.transporter = nodemailer.createTransport(transporter);

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
        let self = this;

        self.transporter.verify(function(err) {
            if (err) {
                callback(err);
            } else {
                self.transporter.sendMail(self, function(err, info, response) {
                    self.err = err;
                    self.info = info;
                    self.response = response;

                    callback(null, self);
                });
            }
        });
    }
}

class Transporter {
    /**
     *
     * @param {String} port
     * @param {String} host
     * @param {Object} auth
     * @param {String} [auth.type]
     * @param {String} auth.user
     * @param {String} auth.pass
     *
     * @param {Object} [options]
     *
     */
    constructor(port, host, auth, options = {}) {
        this.port = port;
        this.host = host;
        this.auth = auth;
        this.authMethod = options.authMethod;

        this.secure = options.secure;
        this.tls = options.tls;
        this.ignoreTLS = options.ignoreTLS;
        this.requireTLS = options.requireTLS;
    }
}

class Inbox {
    /**
     *
     * @param {Transporter} transporter
     *
     */
    constructor(transporter) {
        this.transporter = transporter;
    }

    getEmails(callback) {
        let self = this;
        let imap = new Imap({
            user: self.transporter.auth.user,
            password: self.transporter.auth.pass,
            host: self.transporter.host,
            port: self.transporter.port,
            tls: self.transporter.secure,
            tlsOptions: { rejectUnauthorized: false }
        });

        var emails = [];

        imap.once("ready", function() {
            Log.debug("IMAP connection established.", logModule);
            imap.openBox("INBOX", false, function() {
                Log.debug("Opened INBOX.", logModule);
                imap.search(['UNSEEN', ['SINCE', new Date()]], function(err, results) {
                    Log.debug("Found " + results.length + " UNSEEN messages.", logModule);
                    if (results.length) {
                        const f = imap.fetch(results, {bodies: ''});
                        f.on('message', function(msg) {
                            msg.on('body', function(stream) {
                                simpleParser(stream, async function(err, parsed) {
                                    emails.push(parsed);
                                });
                            });
                            msg.once('attributes', function(attrs) {
                                const {uid} = attrs;
                                imap.addFlags(uid, ['\\Seen'], function() {
                                    // Mark the email as read after reading it
                                    Log.debug("Flagged message " + uid + " as SEEN.", logModule);
                                });
                            });
                        });
                        f.once('error', function(ex) {
                            return Promise.reject(ex);
                        });
                        f.once('end', function() {
                            Log.debug("Sending end command to IMAP.", logModule);
                            imap.end();
                        });
                    } else {
                        Log.debug("Sending end command to IMAP.", logModule);
                        imap.end();
                    }
                });
            });
        });

        imap.once('error', err => {
            callback(err)
        });

        imap.once('end', () => {
            callback(null, emails);
        });

        imap.connect();
        Log.debug("Opening IMAP connection: {user: " + self.transporter.auth.user + " host: " + self.transporter.host + " port: " + self.transporter.port + "}", logModule);
    }
}

module.exports = {
    Email: Email,
    Transporter: Transporter,
    Inbox: Inbox
}
