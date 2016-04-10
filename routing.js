FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {
      content: "viewEventsPage"
    });
  }
});

FlowRouter.route('/events/', {
  name: 'eventsPageRoute',
  action: function(params) {
    BlazeLayout.render("mainLayout", {
      content: "viewEventsPage"
    });
  }
});

FlowRouter.route('/add-event/', {
  name: 'addEventPageRoute',
  action: function(params) {
    BlazeLayout.render("mainLayout", {
      content: "addEventPage"
    });
  }
});


FlowRouter.route('/providers/', {
  name: 'viewProvidersPageRoute',
  subscriptions: function(params) {
    this.register('providers', Meteor.subscribe('providers'));
  },
  action: function(params) {
    BlazeLayout.render("mainLayout", {
      content: "viewProvidersPage"
    });
  }
});

FlowRouter.route('/provider/', {
  name: 'addProvidersPageRoute',
  action: function(params) {
    BlazeLayout.render("mainLayout", {
      content: "addProvidersPage",
      providerId: params.id,
      action: "Add"
    });
  }
});



FlowRouter.route('/provider/:id?', {
  name: 'editProvidersPageRoute',
  subscriptions: function(params) {
    this.register('singleProvider', Meteor.subscribe('singleProvider', params.id));
  },
  action: function(params) {
    BlazeLayout.render("mainLayout", {
      content: "addProvidersPage",
      providerId: params.id,
      action: "Edit"
    });
  }
});