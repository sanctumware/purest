
var Purest = require('../../')
  , providers = require('../../config/providers')


function error (err, done) {
  return (err instanceof Error)
    ? done(err)
    : (console.log(err) || done(new Error('Error response!')))
}

require('../utils/credentials')
var app = require('../../config/app')
  , user = require('../../config/user')

var p = {}
for (var name in providers) {
  var options = {
    provider:name,
    defaults:{headers:{'User-Agent':'Purest'}}
  }
  if (app[name] && user[name] && user[name].token && user[name].secret) {
    options.key = app[name].key
    options.secret = app[name].secret
  }
  p[name] = new Purest(options)
}


describe('salesforce', function () {
  var id = ''
  before(function (done) {
    // POST
    p.salesforce.query('sobjects')
      .post('Lead')
      .options({domain:user.salesforce.domain})
      .json({
        email:'purest@mailinator.com',
        FirstName:'Unkown', LastName:'Unknown', Company:'Unknown'
      })
      .auth(user.salesforce.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.success.should.equal(true)
        id = body.id
        done()
      })
  })
  it('patch', function (done) {
    p.salesforce.query('sobjects')
      .patch('Lead/'+id)
      .options({domain:user.salesforce.domain})
      .json({FirstName:'First', LastName:'Last'})
      .auth(user.salesforce.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)

        // GET
        p.salesforce.query('sobjects')
          .get('Lead/'+id)
          .options({domain:user.salesforce.domain})
          .auth(user.salesforce.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.FirstName.should.equal('First')
            body.LastName.should.equal('Last')
            done()
          })
      })
  })
  after(function (done) {
    // DELETE
    p.salesforce.query('sobjects')
      .del('Lead/'+id)
      .options({domain:user.salesforce.domain})
      .auth(user.salesforce.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        done()
      })
  })
})
