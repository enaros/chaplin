module.exports = (match) ->
  match '', 'home#index'
  match 'conf', 'home#conf'
  match 'about', 'home#about'
  match 'login', 'home#login'
  match 'logout', 'home#logout'
