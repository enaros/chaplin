(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  var Application, Chaplin, SessionController, routes, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  routes = require('routes');

  SessionController = require('controllers/session-controller');

  module.exports = Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      _ref = Application.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Application.prototype.title = 'Brunch example application';

    Application.prototype.initialize = function() {
      Application.__super__.initialize.apply(this, arguments);
      this.initRouter(routes);
      this.initDispatcher({
        controllerSuffix: '-controller'
      });
      this.initLayout();
      this.initComposer();
      this.initMediator();
      this.initControllers();
      this.startRouting();
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Application.prototype.initControllers = function() {
      return new SessionController();
    };

    Application.prototype.initMediator = function() {
      Chaplin.mediator.user = null;
      return Chaplin.mediator.seal();
    };

    return Application;

  })(Chaplin.Application);
  
});
window.require.register("controllers/base/controller", function(exports, require, module) {
  var Chaplin, Controller, HeaderView, SiteView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  SiteView = require('views/site-view');

  HeaderView = require('views/header-view');

  module.exports = Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Controller.prototype.beforeAction = function(params, route) {
      this.compose('site', SiteView);
      return this.compose('header', function() {
        return this.view = new HeaderView({
          route: route
        });
      });
    };

    return Controller;

  })(Chaplin.Controller);
  
});
window.require.register("controllers/home-controller", function(exports, require, module) {
  var AboutView, Chaplin, Configuration, ConfigurationView, Controller, GCCollection, HomeController, HomePageView, LoginView, mediator, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  HomePageView = require('views/home-page-view');

  LoginView = require('views/login-view');

  AboutView = require('views/about-view');

  ConfigurationView = require('views/configuration-view');

  Configuration = require('models/configuration');

  GCCollection = require('models/gc-collection');

  Chaplin = require('chaplin');

  mediator = Chaplin.mediator;

  module.exports = HomeController = (function(_super) {
    __extends(HomeController, _super);

    function HomeController() {
      _ref = HomeController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomeController.prototype.title = 'SteadyMotion';

    HomeController.prototype.initialize = function(opt) {
      var _this = this;
      this.subscribeEvent('loginSuccess', function() {
        console.log(_this, opt.route);
        return mediator.publish("!router:route", "/");
      });
      return this.subscribeEvent('logoutSuccess', function() {
        return mediator.publish("!router:route", "/about");
      });
    };

    HomeController.prototype.index = function() {
      if (!mediator.user) {
        this.login();
        return;
      }
      this.courses = new GCCollection();
      return this.view = new HomePageView({
        region: 'main',
        collection: this.courses
      });
    };

    HomeController.prototype.conf = function() {
      if (!mediator.user) {
        this.login();
        return;
      }
      return this.view = new ConfigurationView({
        region: 'main',
        model: new Configuration
      });
    };

    HomeController.prototype.about = function() {
      return this.view = new AboutView({
        region: 'main'
      });
    };

    HomeController.prototype.login = function() {
      return this.view = new LoginView({
        region: 'main'
      });
    };

    return HomeController;

  })(Controller);
  
});
window.require.register("controllers/session-controller", function(exports, require, module) {
  var AboutView, Chaplin, Controller, SessionsController, mediator, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  AboutView = require('views/about-view');

  Chaplin = require('chaplin');

  mediator = Chaplin.mediator;

  module.exports = SessionsController = (function(_super) {
    __extends(SessionsController, _super);

    function SessionsController() {
      _ref = SessionsController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SessionsController.prototype.initialize = function(opt) {
      var _this = this;
      this.user = new StackMob.User({
        username: 'emiliano'
      });
      this.user.isLoggedIn({
        yes: function() {
          mediator.user = _this.user;
          return mediator.publish('loginSuccess', _this.user);
        },
        no: function() {
          return console.log("Not logged in.");
        }
      });
      this.subscribeEvent('loginAttempt', this.loginAttempt);
      return this.subscribeEvent('logoutAttempt', this.logoutAttempt);
    };

    SessionsController.prototype.loginAttempt = function(password) {
      this.user.set('password', password);
      return this.user.login(false, {
        success: function(model) {
          mediator.user = model;
          return mediator.publish('loginSuccess', mediator.user);
        },
        error: function(model, response) {
          return mediator.publish('loginFailed', model, response);
        }
      });
    };

    SessionsController.prototype.logoutAttempt = function() {
      this.user.logout();
      mediator.user = null;
      return mediator.publish('logoutSuccess');
    };

    return SessionsController;

  })(Controller);
  
});
window.require.register("initialize", function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    window.App = new Application;
    return App.initialize();
  });
  
});
window.require.register("lib/support", function(exports, require, module) {
  var Chaplin, support, utils;

  Chaplin = require('chaplin');

  utils = require('lib/utils');

  support = utils.beget(Chaplin.support);

  module.exports = support;
  
});
window.require.register("lib/utils", function(exports, require, module) {
  var Chaplin, utils;

  Chaplin = require('chaplin');

  utils = Chaplin.utils.beget(Chaplin.utils);

  module.exports = utils;
  
});
window.require.register("lib/view-helper", function(exports, require, module) {
  var Chaplin,
    __slice = [].slice;

  Chaplin = require('chaplin');

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;
    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('url', function() {
    var options, params, routeName, _i;
    routeName = arguments[0], params = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), options = arguments[_i++];
    return Chaplin.helpers.reverse(routeName, params);
  });
  
});
window.require.register("models/base/collection", function(exports, require, module) {
  var Chaplin, Collection, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  Model = require('models/base/model');

  module.exports = Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection() {
      _ref = Collection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Collection.prototype.model = Model;

    return Collection;

  })(Chaplin.Collection);
  
});
window.require.register("models/base/model", function(exports, require, module) {
  var Chaplin, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      _ref = Model.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Model.prototype.get = function(attr) {
      if (attr === 'id') {
        attr = _.find(_.keys(this.attributes), function(i) {
          return i.substr(-3) === "_id";
        });
      }
      return Model.__super__.get.apply(this, arguments);
    };

    return Model;

  })(StackMob.Model);
  
});
window.require.register("models/configuration", function(exports, require, module) {
  var Chaplin, Configuration, Model, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  Chaplin = require('chaplin');

  module.exports = Configuration = (function(_super) {
    __extends(Configuration, _super);

    function Configuration() {
      this.announce = __bind(this.announce, this);
      _ref = Configuration.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    _.extend(Configuration.prototype, Chaplin.SyncMachine);

    _.extend(Configuration.prototype, Chaplin.EventBroker);

    _.extend(Configuration.prototype, Backbone.Validation.mixin);

    Configuration.prototype.schemaName = 'configuration';

    Configuration.prototype.validation = {
      sampleVideo: {
        required: true,
        pattern: 'url',
        msg: 'enter a valid url'
      }
    };

    Configuration.prototype.initialize = function() {
      Configuration.__super__.initialize.apply(this, arguments);
      this.set('configuration_id', '3bd1565f741a48648bc320663ce6b579');
      this.syncStateChange(this.announce);
      return this.fetchConf();
    };

    Configuration.prototype.fetchConf = function() {
      var _this = this;
      this.beginSync();
      return this.fetch({
        success: function() {
          return _this.finishSync();
        }
      });
    };

    Configuration.prototype.announce = function(model, status) {
      this.publishEvent("model-" + status, {});
      return console.log("model-" + status);
    };

    Configuration.prototype.save = function() {
      var _ref1;
      if (((_ref1 = this.get('photo')) != null ? _ref1.substr(0, 7) : void 0) !== 'Content') {
        this.unset('photo');
      }
      return Configuration.__super__.save.apply(this, arguments);
    };

    return Configuration;

  })(Model);
  
});
window.require.register("models/gc-collection", function(exports, require, module) {
  var Chaplin, Collection, GCCollection, GCourse, Model, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  Collection = require('models/base/collection');

  GCourse = require('models/gcourse');

  Chaplin = require('chaplin');

  module.exports = GCCollection = (function(_super) {
    __extends(GCCollection, _super);

    function GCCollection() {
      this.announce = __bind(this.announce, this);
      _ref = GCCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    _.extend(GCCollection.prototype, Chaplin.SyncMachine);

    _.extend(GCCollection.prototype, Chaplin.EventBroker);

    GCCollection.prototype.model = GCourse;

    GCCollection.prototype.initialize = function() {
      GCCollection.__super__.initialize.apply(this, arguments);
      this.syncStateChange(this.announce);
      return this.fetchAll();
    };

    GCCollection.prototype.fetchAll = function() {
      var q,
        _this = this;
      this.beginSync();
      q = new StackMob.Collection.Query();
      q.setExpand(1).orderDesc('createddate');
      return this.query(q, {
        success: function(c) {
          return _this.finishSync();
        }
      });
    };

    GCCollection.prototype.announce = function(collection, status) {
      return this.publishEvent("collection-" + status, {});
    };

    return GCCollection;

  })(StackMob.Collection);
  
});
window.require.register("models/gcourse", function(exports, require, module) {
  var Chaplin, GCCourse, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  Chaplin = require('chaplin');

  module.exports = GCCourse = (function(_super) {
    __extends(GCCourse, _super);

    function GCCourse() {
      _ref = GCCourse.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    _.extend(GCCourse.prototype, Chaplin.SyncMachine);

    GCCourse.prototype.schemaName = 'golfcourse';

    GCCourse.prototype.defaults = {
      name: 'Title',
      photo: '',
      address: 'address',
      description: "lorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emhola"
    };

    GCCourse.prototype.save = function() {
      var _ref1, _ref2, _ref3;
      if (((_ref1 = this.get('photo')) != null ? _ref1.substr(0, 7) : void 0) !== 'Content') {
        this.unset('photo');
      }
      if (!(((_ref2 = this.get('location')) != null ? _ref2.lat : void 0) && ((_ref3 = this.get('location')) != null ? _ref3.lon : void 0))) {
        this.unset('location');
      }
      this.unset('holes');
      console.log('save');
      return GCCourse.__super__.save.apply(this, arguments);
    };

    return GCCourse;

  })(Model);
  
});
window.require.register("models/hole", function(exports, require, module) {
  var Hole, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Hole = (function(_super) {
    __extends(Hole, _super);

    function Hole() {
      _ref = Hole.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    _.extend(Hole.prototype, Backbone.Validation.mixin);

    Hole.prototype.schemaName = 'hole';

    Hole.prototype.validation = {
      video: {
        required: true,
        pattern: 'url',
        msg: 'enter a valid url'
      }
    };

    return Hole;

  })(StackMob.Model);
  
});
window.require.register("models/holes-collection", function(exports, require, module) {
  var Hole, HolesCollection, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Hole = require('models/hole');

  module.exports = HolesCollection = (function(_super) {
    __extends(HolesCollection, _super);

    function HolesCollection() {
      _ref = HolesCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HolesCollection.prototype.model = Hole;

    return HolesCollection;

  })(StackMob.Collection);
  
});
window.require.register("routes", function(exports, require, module) {
  module.exports = function(match) {
    match('', 'home#index');
    match('conf', 'home#conf');
    match('about', 'home#about');
    match('login', 'home#login');
    return match('logout', 'home#logout');
  };
  
});
window.require.register("views/about-view", function(exports, require, module) {
  var AboutView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/about');

  module.exports = AboutView = (function(_super) {
    __extends(AboutView, _super);

    function AboutView() {
      _ref = AboutView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AboutView.prototype.template = template;

    AboutView.prototype.autoRender = true;

    return AboutView;

  })(View);
  
});
window.require.register("views/base/collection-view", function(exports, require, module) {
  var Chaplin, CollectionView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  module.exports = CollectionView = (function(_super) {
    __extends(CollectionView, _super);

    function CollectionView() {
      _ref = CollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

    return CollectionView;

  })(Chaplin.CollectionView);
  
});
window.require.register("views/base/view", function(exports, require, module) {
  var Chaplin, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  require('lib/view-helper');

  module.exports = View = (function(_super) {
    __extends(View, _super);

    function View() {
      _ref = View.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    View.prototype.getTemplateFunction = function() {
      return this.template;
    };

    return View;

  })(Chaplin.View);
  
});
window.require.register("views/compact-view", function(exports, require, module) {
  var CompactView, FileView, HolesCollection, HolesListView, View, template, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  FileView = require('views/file-view');

  HolesListView = require('views/holes-list-view');

  HolesCollection = require('models/holes-collection');

  template = require('views/templates/compact');

  module.exports = CompactView = (function(_super) {
    __extends(CompactView, _super);

    function CompactView() {
      this["delete"] = __bind(this["delete"], this);
      _ref = CompactView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CompactView.prototype.template = template;

    CompactView.prototype.tagName = 'li';

    CompactView.prototype.className = 'span3';

    CompactView.prototype.render = function() {
      CompactView.__super__.render.apply(this, arguments);
      this.subview('holesList', new HolesListView({
        container: this.$el.find('.back'),
        collection: new HolesCollection(this.model.get('holes' || new Array)),
        parentModel: this.model
      }));
      return this.renderMap();
    };

    CompactView.prototype.initialize = function(options) {
      CompactView.__super__.initialize.apply(this, arguments);
      this.registerRegion({
        'holesList': '.back'
      });
      return this.initButtons();
    };

    CompactView.prototype.initButtons = function() {
      this.delegate('click', '.edit-pic', this.click);
      this.delegate('click', '.delete', this["delete"]);
      this.delegate('click', '.btn-map', this.toggleMap);
      this.delegate('click', '.btn-toggle-holes', function() {
        return this.$el.toggleClass('flipped');
      });
      this.delegate('blur', '.name', this.valChange);
      this.delegate('blur', '.description', this.valChange);
      this.delegate('blur', '.phone', this.valChange);
      this.delegate('blur', '.address', this.updateAddress);
      this.delegate('change', 'input[type=file]', this.fileInput);
      this.delegate('dragover', '.drag-drop', this.dragOver);
      this.delegate('drop', '.drag-drop', this.dropFile);
      return this.delegate('dragleave', '.drag-drop', this.dragOver);
    };

    CompactView.prototype.updateAddress = function(e) {
      if ($(e.currentTarget).text() !== this.model.get('address')) {
        this.valChange(e, false);
        return this.refreshMap(e);
      }
    };

    CompactView.prototype.updateLocation = function(location) {
      var latlon;
      latlon = new StackMob.GeoPoint(location.lat(), location.lng());
      if (latlon.lat !== this.model.get('location').lat && latlon.lon !== this.model.get('location').lon) {
        this.model.set('location', latlon.toJSON());
        return this.model.save();
      }
    };

    CompactView.prototype.refreshMap = function(e) {
      var address, geocoder,
        _this = this;
      address = $(e.currentTarget).text();
      geocoder = new google.maps.Geocoder();
      if (geocoder) {
        return geocoder.geocode({
          'address': address
        }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            return _this.addMapMarker(results[0].geometry.location);
          }
        });
      }
    };

    CompactView.prototype.addMapMarker = function(location) {
      var _this = this;
      if (this.marker != null) {
        this.marker.setPosition(location);
      } else {
        this.marker = new google.maps.Marker({
          map: this.map,
          position: location,
          cursor: 'pointer',
          draggable: true
        });
      }
      this.map.setZoom(15);
      this.map.setCenter(location);
      this.updateLocation(location);
      google.maps.event.addListener(this.marker, 'dragend', function(obj) {
        return _this.updateLocation(obj.latLng);
      });
      this.marker.setAnimation(google.maps.Animation.BOUNCE);
      return setTimeout((function(e) {
        return _this.marker.setAnimation(null);
      }), 2000);
    };

    CompactView.prototype.renderMap = function() {
      var latlon, mapOptions, _ref1, _ref2;
      if (!this.map) {
        latlon = new google.maps.LatLng(((_ref1 = this.model.get('location')) != null ? _ref1.lat : void 0) || -34.60358190549192, ((_ref2 = this.model.get('location')) != null ? _ref2.lon : void 0) || 58.38167893068851);
        mapOptions = {
          center: latlon,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.$el.find('.map')[0], mapOptions);
        if (this.model.get('location') != null) {
          return this.addMapMarker(latlon);
        }
      }
    };

    CompactView.prototype.toggleMap = function(e) {
      this.$el.find('.edit-pic').toggle();
      this.$el.find('.map').toggle();
      google.maps.event.trigger(this.map, 'resize');
      if (this.marker != null) {
        return this.map.setCenter(this.marker.getPosition());
      }
    };

    CompactView.prototype.click = function(e) {
      var el;
      e.preventDefault();
      el = $(e.currentTarget);
      return this.$el.find("input[type=file]").click();
    };

    CompactView.prototype.valChange = function(e, commitSave) {
      var el;
      if (commitSave == null) {
        commitSave = true;
      }
      el = $(e.currentTarget);
      if (el.text() !== this.model.get(el.attr('class'))) {
        this.model.set(el.attr('class'), el.text());
        if (commitSave) {
          return this.model.save();
        }
      }
    };

    CompactView.prototype["delete"] = function(e) {
      var _this = this;
      e.preventDefault();
      if (confirm('Are you sure?')) {
        return this.$el.fadeOut(function() {
          return _this.model.destroy();
        });
      }
    };

    return CompactView;

  })(FileView);
  
});
window.require.register("views/configuration-view", function(exports, require, module) {
  var ConfigurationView, FileView, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FileView = require('views/file-view');

  template = require('views/templates/configuration');

  module.exports = ConfigurationView = (function(_super) {
    __extends(ConfigurationView, _super);

    function ConfigurationView() {
      _ref = ConfigurationView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ConfigurationView.prototype.template = template;

    ConfigurationView.prototype.className = 'ipad';

    ConfigurationView.prototype.backgroundImageSelector = '.ipad-screen';

    ConfigurationView.prototype.initialize = function() {
      var _this = this;
      ConfigurationView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('model-synced', function(e) {
        return _this.render();
      });
      this.delegate('dragover', '.drag-drop', this.dragOver);
      this.delegate('drop', '.drag-drop', this.dropFile);
      this.delegate('dragleave', '.drag-drop', this.dragOver);
      this.delegate('change', 'input[type=file]', this.fileInput);
      this.delegate('click', '.edit-pic', function() {
        return this.$el.find("input[type=file]").click();
      });
      this.delegate('click', '.play', function(e) {
        return window.open(this.model.get($(e.currentTarget).parent().attr('data')));
      });
      this.delegate('click', '.edit', this.edit);
      return this.delegate('click', '#myModal .btn-primary', this.save);
    };

    ConfigurationView.prototype.getTemplateData = function(model) {
      console.log(this.model.attributes);
      return this.model.attributes;
    };

    ConfigurationView.prototype.edit = function(e) {
      var attr, modal;
      attr = $(e.currentTarget).parent().attr('data');
      modal = this.$('#myModal');
      modal.find('#myModalLabel').text(attr);
      modal.find('textarea').val(this.model.get(attr)).attr('data', attr);
      return modal.modal();
    };

    ConfigurationView.prototype.save = function(e) {
      var attr, modal, val;
      modal = this.$('#myModal');
      attr = modal.find('#myModalLabel').text();
      val = modal.find('textarea').val();
      this.model.set(attr, val);
      this.model.save();
      return modal.modal('hide');
    };

    return ConfigurationView;

  })(FileView);
  
});
window.require.register("views/file-view", function(exports, require, module) {
  var FileView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  module.exports = FileView = (function(_super) {
    __extends(FileView, _super);

    function FileView() {
      this.readerOnLoad = __bind(this.readerOnLoad, this);
      _ref = FileView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FileView.prototype.backgroundImageSelector = '.img';

    FileView.prototype.dropFile = function(e) {
      this.dragOver(e);
      this.photo(e.originalEvent.dataTransfer.files[0]);
      return console.log('drop');
    };

    FileView.prototype.dragOver = function(e) {
      e.originalEvent.stopImmediatePropagation();
      e.originalEvent.stopPropagation();
      e.originalEvent.preventDefault();
      if (e.type === "dragover") {
        return this.$el.find('.drag-drop').css('opacity', .9);
      } else {
        return this.$el.find('.drag-drop').css('opacity', 0);
      }
    };

    FileView.prototype.fileInput = function(ev) {
      return this.photo(ev.target.files[0]);
    };

    FileView.prototype.photo = function(file) {
      var fileContent, reader;
      reader = new FileReader();
      reader.onload = this.readerOnLoad(file);
      return fileContent = reader.readAsDataURL(file);
    };

    FileView.prototype.readerOnLoad = function(theFile) {
      var _this = this;
      return function(e) {
        var base64Content, fileName, fileType;
        base64Content = e.target.result.substring(e.target.result.indexOf(',') + 1, e.target.result.length);
        fileName = theFile.name;
        fileType = theFile.type;
        _this.model.setBinaryFile('photo', _this.model.get('id'), fileType, base64Content);
        _this.model.save();
        return _this.$el.find(_this.backgroundImageSelector).css('background-image', "url(" + e.target.result + ")");
      };
    };

    return FileView;

  })(View);
  
});
window.require.register("views/header-view", function(exports, require, module) {
  var Chaplin, HeaderView, View, mediator, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/header');

  Chaplin = require('chaplin');

  mediator = Chaplin.mediator;

  module.exports = HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      _ref = HeaderView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HeaderView.prototype.autoRender = true;

    HeaderView.prototype.className = 'navbar';

    HeaderView.prototype.region = 'header';

    HeaderView.prototype.id = 'header';

    HeaderView.prototype.template = template;

    HeaderView.prototype.initialize = function(options) {
      HeaderView.__super__.initialize.apply(this, arguments);
      this.route = options.route;
      this.subscribeEvent('loginSuccess', this.loginSuccess);
      this.subscribeEvent('loginFailed', this.loginFailed);
      this.subscribeEvent('!router:route', this.routeChanged);
      return this.initButtons();
    };

    HeaderView.prototype.initButtons = function() {
      this.delegate('submit', '#login-form', this.login);
      this.delegate('click', '#logout-form button', this.logout);
      this.delegate('click', 'li', this.click);
      return this.delegate('click', '.brand', function() {
        return this.selectMenuItem(this.$('ul li:first'));
      });
    };

    HeaderView.prototype.routeChanged = function(path, opts) {
      var item;
      console.log(path);
      item = path.substr(1);
      if (item === "") {
        item = 'list';
      }
      return this.selectMenuItem(this.$("." + item));
    };

    HeaderView.prototype.login = function(e) {
      e.preventDefault();
      console.log('login');
      return mediator.publish('loginAttempt', this.$('#login-form input').val());
    };

    HeaderView.prototype.loginFailed = function() {
      this.$('#login-form').addClass('error');
      return this.$('#login-form input').select();
    };

    HeaderView.prototype.loginSuccess = function() {
      this.$('#login-form').hide().removeClass('error');
      this.$('#logout-form').fadeIn();
      return console.log('loginSuccess');
    };

    HeaderView.prototype.logout = function() {
      this.$('#logout-form').hide();
      this.$('#login-form').fadeIn();
      return mediator.publish('logoutAttempt');
    };

    HeaderView.prototype.click = function(e) {
      e.preventDefault();
      return this.selectMenuItem($(e.currentTarget));
    };

    HeaderView.prototype.selectMenuItem = function(el) {
      this.$('ul').attr('class', 'nav');
      this.$('ul li').removeClass('active');
      return el.addClass('active');
    };

    HeaderView.prototype.getTemplateData = function() {
      return {
        route: this.route.action,
        showLogin: mediator.user ? "hide" : "",
        showWelcome: mediator.user ? "" : "hide"
      };
    };

    return HeaderView;

  })(View);
  
});
window.require.register("views/hole-item-view", function(exports, require, module) {
  var HoleItemView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/hole-item');

  module.exports = HoleItemView = (function(_super) {
    __extends(HoleItemView, _super);

    function HoleItemView() {
      _ref = HoleItemView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HoleItemView.prototype.template = template;

    HoleItemView.prototype.tagName = 'li';

    HoleItemView.prototype.className = 'hole-item';

    HoleItemView.prototype.listen = {
      'validated:invalid model': 'invalidModel',
      'validated:valid model': 'validModel'
    };

    HoleItemView.prototype.initialize = function() {
      HoleItemView.__super__.initialize.apply(this, arguments);
      this.delegate('click', '.remove-video', this.removeItem);
      this.delegate('click', '.open-video', function() {
        return window.open(this.model.get('video'));
      });
      this.delegate('focus', 'span', function(e) {
        return $(e.currentTarget).text(this.model.get('video'));
      });
      return this.delegate('blur', 'span', function(e) {
        var index;
        this.model.set({
          video: $(e.currentTarget).text()
        });
        this.model.save();
        index = _.findIndex(this.model.collection.models, this.model) + 1;
        return $(e.currentTarget).text("video " + index);
      });
    };

    HoleItemView.prototype.render = function() {
      return HoleItemView.__super__.render.apply(this, arguments);
    };

    HoleItemView.prototype.removeItem = function(e) {
      var _this = this;
      e.preventDefault();
      return this.$el.slideUp(function() {
        return _this.model.destroy();
      });
    };

    HoleItemView.prototype.getTemplateData = function() {
      return _.extend(this.model.attributes, {
        index: _.findIndex(this.model.collection.models, this.model) + 1
      });
    };

    HoleItemView.prototype.invalidModel = function(model, err) {
      return this.$el.addClass('alert-error');
    };

    HoleItemView.prototype.validModel = function(model) {
      return this.$el.removeClass('alert-error');
    };

    return HoleItemView;

  })(View);
  
});
window.require.register("views/holes-list-view", function(exports, require, module) {
  var ColectionView, HoleItemView, HolesListView, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ColectionView = require('views/base/collection-view');

  HoleItemView = require('views/hole-item-view');

  template = require('views/templates/holes-list');

  module.exports = HolesListView = (function(_super) {
    __extends(HolesListView, _super);

    function HolesListView() {
      _ref = HolesListView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HolesListView.prototype.autoRender = true;

    HolesListView.prototype.template = template;

    HolesListView.prototype.listSelector = 'ul';

    HolesListView.prototype.itemView = HoleItemView;

    HolesListView.prototype.emptyValue = 'http://vimeo.com';

    HolesListView.prototype.listen = {
      'add collection': 'addRelationship',
      'destroy collection': 'removeRelationship'
    };

    HolesListView.prototype.initialize = function(options) {
      this.parentModel = options.parentModel;
      HolesListView.__super__.initialize.apply(this, arguments);
      Backbone.Validation.bind(this);
      return this.delegate('click', '.btn-add', this.addItem);
    };

    HolesListView.prototype.addItem = function() {
      var item;
      item = {
        video: this.$el.find('input[type=text]').val()
      };
      return this.collection.create(item, {
        wait: true
      });
    };

    HolesListView.prototype.addRelationship = function(model) {
      this.$el.find('input[type=text]').val(this.emptyValue);
      return this.parentModel.appendAndSave('holes', [model.get('hole_id')]);
    };

    HolesListView.prototype.removeRelationship = function(model) {
      this.parentModel.deleteAndSave('holes', [model.get('hole_id')], StackMob.SOFT_DELETE);
      return this.$el.find('.holes-list .text').each(function(i, o) {
        return $(o).text("video " + (i + 1));
      });
    };

    HolesListView.prototype.getTemplateData = function() {
      return {
        defaultValue: this.emptyValue
      };
    };

    return HolesListView;

  })(ColectionView);
  
});
window.require.register("views/home-page-view", function(exports, require, module) {
  var Chaplin, CollectionView, CompactView, GCourse, HomePageView, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/home');

  CollectionView = require('views/base/collection-view');

  GCourse = require('models/gcourse');

  CompactView = require('views/compact-view');

  Chaplin = require('chaplin');

  module.exports = HomePageView = (function(_super) {
    __extends(HomePageView, _super);

    function HomePageView() {
      _ref = HomePageView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    _.extend(HomePageView.prototype, Chaplin.EventBroker);

    HomePageView.prototype.className = 'home-page row-fluid';

    HomePageView.prototype.template = template;

    HomePageView.prototype.listSelector = 'ul';

    HomePageView.prototype.fallbackSelector = '.fallback';

    HomePageView.prototype.loadingSelector = '.loading';

    HomePageView.prototype.initialize = function() {
      var _this = this;
      HomePageView.__super__.initialize.apply(this, arguments);
      this.delegate('click', '.btn-add-gc', function() {
        return _this.collection.create(new GCourse, {
          at: 0
        });
      });
      return this.subscribeEvent('collection-synced', function(e) {
        return console.log('collection synced!!');
      });
    };

    HomePageView.prototype.listen = {
      'addedToDOM': function() {
        return console.log('home-rendered');
      },
      'visibilityChange': 'visibilityChange'
    };

    HomePageView.prototype.visibilityChange = function() {};

    HomePageView.prototype.initItemView = function(model) {
      return new CompactView({
        model: model
      });
    };

    return HomePageView;

  })(CollectionView);
  
});
window.require.register("views/login-view", function(exports, require, module) {
  var LoginView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/login');

  module.exports = LoginView = (function(_super) {
    __extends(LoginView, _super);

    function LoginView() {
      _ref = LoginView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LoginView.prototype.template = template;

    LoginView.prototype.autoRender = true;

    return LoginView;

  })(View);
  
});
window.require.register("views/site-view", function(exports, require, module) {
  var SiteView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/site');

  module.exports = SiteView = (function(_super) {
    __extends(SiteView, _super);

    function SiteView() {
      _ref = SiteView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SiteView.prototype.container = 'body';

    SiteView.prototype.id = 'site-container';

    SiteView.prototype.regions = {
      '#header-container': 'header',
      '#page-container': 'main'
    };

    SiteView.prototype.template = template;

    SiteView.prototype.initialize = function() {
      SiteView.__super__.initialize.apply(this, arguments);
      this.delegate('dragenter', function(e) {
        e.originalEvent.stopImmediatePropagation();
        e.originalEvent.stopPropagation();
        return e.originalEvent.preventDefault();
      });
      return this.delegate('dragleave', function(e) {
        e.originalEvent.stopImmediatePropagation();
        e.originalEvent.stopPropagation();
        return e.originalEvent.preventDefault();
      });
    };

    SiteView.prototype.render = function() {
      SiteView.__super__.render.apply(this, arguments);
      return console.log('render siteview layout');
    };

    return SiteView;

  })(View);
  
});
window.require.register("views/templates/about", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
    


    return "<center style='margin-top:50px'>Emiliano Onorati &copy; 2013</center>";
    });
});
window.require.register("views/templates/compact", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


    buffer += "<div class=\"thumbnail\">\r\n  <div class=\"img\" style=\"background-image:url(";
    if (stack1 = helpers.photo) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.photo; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "?";
    if (stack1 = helpers.lastmoddate) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.lastmoddate; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + ")\">\r\n  	<div class=\"map\"></div>\r\n  	<div class=\"drag-drop\">Drop image here</div>\r\n  </div>\r\n  <a class='btn edit-pic' data-toggle=\"tooltip\" title=\"click to change picture\"><i class='icon-pencil'></i></a>\r\n  <input type='file' class='hidden'></input>\r\n  <div class=\"caption\">\r\n    <h3 contenteditable=\"true\" class=\"name\">";
    if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</h3>\r\n    <div class=\"options\">\r\n      <i class=\"icon-home\"></i> <p contenteditable=\"true\" class=\"address\">";
    if (stack1 = helpers.address) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.address; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</p>\r\n    	<i class=\"icon-user\"></i> <p contenteditable=\"true\" class=\"phone\">";
    if (stack1 = helpers.phone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.phone; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</p>\r\n    </div>\r\n    <p contenteditable=\"true\" class=\"description\">";
    if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</p>\r\n    <div class=\"text-right\">\r\n    	<a class=\"btn -btn-mini btn-toggle-holes btn-primary\">holes</a>\r\n    	<a class=\"btn -btn-mini btn-map\" data-toggle=\"button\"><i class=\"icon-map-marker\"></i></a>\r\n    	<a class=\"btn -btn-mini btn-danger delete\"><i class=\"icon-trash icon-white\"></i></a>\r\n    </div>\r\n  </div>\r\n</div>\r\n<div class='thumbnail back'>\r\n  "
      + "\r\n</div>";
    return buffer;
    });
});
window.require.register("views/templates/configuration", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


    buffer += "<div class='ipad-screen' style=\"background-image:url(";
    if (stack1 = helpers.photo) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.photo; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "?";
    if (stack1 = helpers.lastmoddate) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.lastmoddate; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + ")\">\n	<div class='drag-drop'> Drop image here...</div>\n	<a class='btn edit-pic' data-toggle=\"tooltip\" title=\"click to change picture\"><i class='icon-pencil'></i></a>\n  	<input type='file' class='hidden'></input>\n	<div class='fields row-fluid'>\n		<div class='span12'>\n			<div class=\"span4\">\n				<div class=\"btn-group\" data='sample'>\n				  <button class=\"btn play\"><i class=\"icon-play-circle\"></i> Sample</button>\n				  <button class=\"btn edit\"><i class=\"icon-pencil\"></i></button>\n				</div>\n				<div class=\"btn-group\" data='sample2'>\n				  <button class=\"btn play\"><i class=\"icon-play-circle\"></i> Sample 2</button>\n				  <button class=\"btn edit\"><i class=\"icon-pencil\"></i></button>\n				</div>\n			</div>\n			<div class=\"span4\">\n				<div class=\"btn-group\" data='marine'>\n				  <button class=\"btn play\"><i class=\"icon-play-circle\"></i> Marine</button>\n				  <button class=\"btn edit\"><i class=\"icon-pencil\"></i></button>\n				</div>\n				<div class=\"btn-group\" data='graphics3d'>\n				  <button class=\"btn play\"><i class=\"icon-play-circle\"></i> 3D Graph</button>\n				  <button class=\"btn edit\"><i class=\"icon-pencil\"></i></button>\n				</div>\n			</div>\n			<div class=\"span4\">\n				<div class=\"btn-group\" data='real_state'>\n				  <button class=\"btn play\"><i class=\"icon-play-circle\"></i> R. State</button>\n				  <button class=\"btn edit\"><i class=\"icon-pencil\"></i></button>\n				</div>\n				<div class=\"btn-group\" data='university'>\n				  <button class=\"btn play\"><i class=\"icon-play-circle\"></i> University</button>\n				  <button class=\"btn edit\"><i class=\"icon-pencil\"></i></button>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n\n<!-- Modal -->\n<div id=\"myModal\" class=\"modal hide fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n    <h3 id=\"myModalLabel\"></h3>\n  </div>\n  <div class=\"modal-body\">\n    <p><textarea class='input-block-level'></textarea></p>\n  </div>\n  <div class=\"modal-footer\">\n    <button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>\n    <button class=\"btn btn-primary\">Save changes</button>\n  </div>\n</div>";
    return buffer;
    });
});
window.require.register("views/templates/header", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


    buffer += "<div class=\"navbar-inner\">\n	<div class=\"container\" style=\"width: auto; padding: 0 20px;\">\n	  <!-- .btn-navbar is used as the toggle for collapsed navbar content -->\n    <a class=\"btn btn-navbar\" data-toggle=\"collapse\" data-target=\".nav-collapse\">\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n    </a>\n	  <a class=\"brand\" href=\"/\">Title</a>\n	  <div class=\"nav-collapse collapse\">\n		  <ul class=\"nav select-";
    if (stack1 = helpers.route) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.route; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\">\n		    <li class=\"list\"><a href=\"/\">List</a></li>\n		    <li class=\"conf\"><a href=\"conf\">Configuration</a></li>\n		    <li class=\"about\"><a href=\"about\">About</a></li>\n		  </ul>\n		  <form id=\"login-form\" class=\"navbar-form pull-right control-group ";
    if (stack1 = helpers.showLogin) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.showLogin; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\">\n			  <div class=\"input-append\">\n				  <input type=\"text\" class=\"span2\" />\n				  <button type=\"submit\" class=\"btn btn-success\">Login</button>\n				</div>\n			</form>\n			<div id=\"logout-form\" class=\"pull-right ";
    if (stack1 = helpers.showWelcome) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.showWelcome; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\">\n				<button class=\"btn btn-inverse\">Logout</button>\n			</div>\n		</div>\n	</div>\n</div>";
    return buffer;
    });
});
window.require.register("views/templates/hole-item", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


    buffer += "<div class=\"btn-group pull-right\">\n	<a class=\"btn btn-mini dropdown-toggle menu\" data-toggle=\"dropdown\" href=\"#\" tabindex=\"-1\"><span class=\"caret\"></span></a>\n	<ul class=\"dropdown-menu\">\n		<li class='open-video'><a href=\"#\"><i class=\"icon-facetime-video\"></i> open video</a></li>\n		<li class=\"remove-video\"><a href=\"#\"><i class=\"icon-remove\"></i> remove</a></li>\n	</ul>\n</div>\n<span contenteditable=\"true\" class=\"text\">video ";
    if (stack1 = helpers.index) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.index; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</span>";
    return buffer;
    });
});
window.require.register("views/templates/holes-list", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


    buffer += "<a class=\"btn go-back btn-toggle-holes btn-mini btn-primary\"><i class='icon-arrow-left icon-white'></i></a>\n<h4 class=\"text-center\">Sub list</h4>\n<div class=\"holes-input\">\n	<button class=\"btn btn-success btn-add\" type=\"button\"><i class=\"icon-plus icon-white\"></i></button>\n	<input class=\"input-block-level\" type=\"text\" value=\"";
    if (stack1 = helpers.defaultValue) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.defaultValue; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\"/>\n</div>\n<ul class=\"holes-list\"></ul>";
    return buffer;
    });
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
    


    return "<div style=\"float:right; margin-top: 20px\">\n	<button class=\"btn btn-success btn-add-gc\"><i class=\"icon-plus icon-white\"></i> Add</button>\n</div>\n<h1>List</h1>\n<ul class='thumbnails'></ul>\n<!--\n<p class='loading'>Loading...</p>\n<p class='fallback'>No items</p>\n-->";
    });
});
window.require.register("views/templates/login", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
    


    return "<div class=\"alert alert-error\" style='margin-top:50px'>\n	<button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n	<h4>Attention!!</h4> \n	Please log in before continue\n</div>";
    });
});
window.require.register("views/templates/site", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
    


    return "<header class=\"navbar navbar-fixed-top\" id=\"header-container\"></header>\n<div class=\"container outer-container\" id=\"page-container\"></div>";
    });
});
