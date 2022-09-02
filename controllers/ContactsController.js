const ContactModel = require('../models/contact');
const Repository = require('../models/repository');
module.exports =
    class ContactsController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext);
            this.repository = new Repository(new ContactModel());
        }
        get(id) {
            if (this.repository != null) {
                if (!isNaN(id)) {
                    let data = this.repository.get(id);
                    if (data != null)
                        this.HttpContext.response.JSON(data);
                    else
                        this.HttpContext.response.notFound();
                }
                else
                    this.HttpContext.response.JSON(this.repository.getAll());
            }
            else
                this.HttpContext.response.notImplemented();
        }
        post(data) {
            if (this.repository != null) {
                data = this.repository.add(data);
                if (data) {
                    if (data.conflict)
                        this.HttpContext.response.conflict();
                    else
                        this.HttpContext.response.created(data);
                } else
                    this.HttpContext.response.unprocessable();
            } else
                this.HttpContext.response.notImplemented();
        }
        put(data) {
            if (this.repository != null) {
                let updateResult = this.repository.update(data);
                if (updateResult == this.repository.updateResult.ok)
                    this.HttpContext.response.ok();
                else
                    if (updateResult == this.repository.updateResult.conflict)
                        this.HttpContext.response.conflict();
                    else
                        if (updateResult == this.repository.updateResult.notfound)
                            this.HttpContext.response.notFound();
                        else // this.repository.updateResult.invalid
                            this.HttpContext.response.unprocessable();
            } else
                this.HttpContext.response.notImplemented();
        }
        remove(id) {
            if (this.repository != null) {
                if (this.repository.remove(id))
                    this.HttpContext.response.accepted();
                else
                    this.HttpContext.response.notFound();
            } else
                this.HttpContext.response.notImplemented();
        }
    }