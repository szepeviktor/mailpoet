define([
    'newsletter_editor/App',
    'newsletter_editor/components/save',
    'amd-inject-loader!newsletter_editor/components/save'
  ], function(EditorApplication, SaveComponent, SaveInjector) {

  describe('Save', function() {
    describe('save method', function() {
      var module;
      before(function() {
        module = SaveInjector({
          'mailpoet': {
            Ajax: {
              post: function() {
                  var deferred = jQuery.Deferred();
                  deferred.resolve({});
                  return deferred;
              }
            }
          }
        });
      });

      it('triggers beforeEditorSave event', function() {
        var spy = sinon.spy();
        global.stubChannel(EditorApplication, {
          trigger: spy,
        });
        EditorApplication.toJSON = sinon.stub();
        module.save();
        expect(spy.withArgs('beforeEditorSave').calledOnce).to.be.true;
      });

      it('triggers afterEditorSave event', function() {
        var stub = sinon.stub().callsArgWith(2, { success: true }),
          spy = sinon.spy();
        global.stubChannel(EditorApplication, {
          trigger: spy,
        });
        EditorApplication.toJSON = sinon.stub();
        module.save();
        expect(spy.withArgs('afterEditorSave').calledOnce).to.be.true;
      });

      it('sends newsletter json to server for saving', function() {
        var mock = sinon.mock({ saveNewsletter: function() {} }).expects('saveNewsletter').once().returns(jQuery.Deferred());
        var module = SaveInjector({
          'mailpoet': {
            Ajax: {
              post: mock,
            }
          }
        });
        global.stubChannel(EditorApplication);

        EditorApplication.toJSON = sinon.stub().returns({});
        module.save();

        mock.verify();
      });
    });

    describe('view', function() {
      var view;
      before(function() {
        EditorApplication._contentContainer = { isValid: sinon.stub().returns(true) };
        global.stubConfig(EditorApplication);
        view = new (SaveComponent.SaveView)();
      });

      it('renders', function() {
        expect(view.render).to.not.throw();
      });

      describe('once rendered', function() {
        var view;
        beforeEach(function() {
          EditorApplication._contentContainer = { isValid: sinon.stub().returns(true) };
          view = new (SaveComponent.SaveView)();
          view.render();
        });

        it('triggers newsletter saving when clicked on save button', function() {
          var mock = sinon.mock({ trigger: function() {} }).expects('trigger').once().withArgs('save');
          global.stubChannel(EditorApplication, {
            trigger: mock,
          });
          view.$('.mailpoet_save_button').click();

          mock.verify();
        });

        it('displays saving options when clicked on save options button', function() {
          view.$('.mailpoet_save_show_options').click();
          expect(view.$('.mailpoet_save_options')).to.not.have.$class('mailpoet_hidden');
        });

        it('triggers template saving when clicked on save as template button', function() {
          var mock = sinon.mock({ post: function() {} }).expects('post').once().returns(jQuery.Deferred()),
            html2canvasMock = jQuery.Deferred();

          html2canvasMock.resolve({
            toDataURL: function() { return 'somedataurl'; },
          });

          EditorApplication.getBody = sinon.stub();
          var module = SaveInjector({
            'mailpoet': {
              Ajax: {
                post: mock,
              }
            },
            'newsletter_editor/App': EditorApplication,
            'html2canvas': function() { return html2canvasMock; },
          });
          var view = new (module.SaveView)();
          view.render();

          view.$('.mailpoet_save_as_template_name').val('A sample template');
          view.$('.mailpoet_save_as_template_description').val('Sample template description');
          view.$('.mailpoet_save_as_template').click();

          mock.verify();
        });
      });
    });
  });
});
