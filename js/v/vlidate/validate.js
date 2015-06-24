    (function($){

        var Validator = function(elem, options) {
            this.$form = $(elem),
            this.opts = $.extend({}, Validator.defaults, options);
            this.init();
        };

        Validator.prototype = {
            init: function() {
                var self = this;

                self.submitButton = self.$form.find(':submit')[0];
                self.validateDelegate(self.$form, ':text, [type="password"]', 'focusin focusout keyup');
                self.bindEvent();
            },
            bindEvent: function() {
                var self = this,
                    opts = self.opts;

                self.$form.submit(function(e){
                    if (opts.debug) {
                        e.preventDefault();
                    }

                    function handle() {
                        if (opts.submitHandler) {
                            opts.submitHandler.call(self, self.$form, e);
                            return false;
                        }
                        return true;
                    }

                    if (self.form()) {
                        return handle();
                    } else {
                        self.focusInvalid();
                        return false;
                    }
                });
            },
            phoneVaild: function(){

            },
            emailValid: function() {

            },
            executeError: function() {

            },
            checkForm: function() {
                var self = this,
                    opts = self.opts,
                    action;

            this.prepareForm();
            for ( var i = 0, elements = ( this.currentElements = this.elements() ); elements[ i ]; i++ ) {
                this.check( elements[ i ] );
            }
            return this.valid();
/*                if (opts.multimode) {
                    action = $(self.submitButton).data('action');
                }

                return (action === 'phone' ? this.validPhone() : validator.validEmail())*/
                this.showErrors();
                return this.valid();
            },
            form: function() {
                this.checkForm();
                this.showErrors();
                return this.valid();
            },
            submitHandler: function(elem, e) {

            },
            focusInvalid: function() {

            },
            submit: function(e) {
                validator.submitButton = this;
                if (validator.debug) {
                    e.preventDefault();
                }

                function handle() {
                    if (validator.submitHandler) {
                        validator.submitHandler.call(validator, this, e);
                        return false;
                    }
                    return true;
                }

                if (validator.executeValid()) {
                    return handle();
                } else {
                    validator.focusInvalid();
                    return false;
                }
            },
            validateDelegate: function($elem, delegate, type) {
                var self = this,
                    opts = self.opts;

                function handler(e) {
                    var eventType = "on" + e.type.replace( /^validate/, "" );

                    if ( opts[ eventType ] && !this.is( opts.ignore ) ) {
                        opts[ eventType ].call( self, this[0], e );
                    }
                };

                return $elem.on(type, function(e) {
                    var $target = $(e.target);
                    if ($target.is(delegate)) {
                        return handler.apply($target, arguments);
                    }
                });
            }
        };

        Validator.defaults = {
            debug: true,
            focusInvalid: true,
            message: {},
            rules: {},
            errorElement: 'label',
            focusInvalid: true,
            errorLabelContainer: null,
            onsubmit: true,
            ignore: ':hidden',
            multimode: false,
            onfocusout: function( element ) {
                if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
                    this.element( element );
                }
            },
            onkeyup: function( element, event ) {
                if ( event.which === 9 && this.elementValue( element ) === "" ) {
                    return;
                } else if ( element.name in this.submitted || element === this.lastElement ) {
                    this.element( element );
                }
            },
            onclick: function( element ) {
                // click on selects, radiobuttons and checkboxes
                if ( element.name in this.submitted ) {
                    this.element( element );

                // or option elements, check parent select in that case
                } else if ( element.parentNode.name in this.submitted ) {
                    this.element( element.parentNode );
                }
            }
        }

                // bridging
        $.fn.validate = function(options) {

            if (!this.length) {
                if (options && options.debug && window.console) {
                    console.warn("Nothing selected, cant't validata.");
                }
                return;
            }
            var validator = $.data( this[0], 'validator');

            if (validator) {
                return validator;
            }

            $.data(this[0], 'validator', validator);
            
            validator = new Validator(this[0], options);

            return validator;
        };

    })(jQuery);