'use strict';
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const assert = require('assert');
const utils = require('../src/utils');
const tempDir = path.resolve(__dirname, './temp');
const pem = require('pem');
const config = require('./test-config');


describe('Utils', () => {
  it('getLogger - returns log instance', (done) => {
    var logger = utils.getLogger('test');
    assert(logger);
    logger('spec');
    done();
  });

  it('checksum - returns checksum', (done) => {
    var str = utils.checksum('test');
    assert(str);
    //  console.log(str);
    done();
  });

  it('exec - executes command and returns promise', (done) => {
    utils.exec('node --version').then((resp) => {
      assert(resp);

      done();
    });
  });

  describe('certificate utils', () => {
    var cmds = [];


    it('getPkcs12CertCmd - returns filename and command', (done) => {
      var str = utils.getPkcs12CertCmd(config.certs.p12, 'test', tempDir);
      assert(str);
      cmds.push(str);
      done();
    });

    it('getPkcs12KeyCmd - returns filename and command', (done) => {
      var str = utils.getPkcs12KeyCmd(config.certs.p12, 'test', tempDir);
      assert(str);
      cmds.push(str);

      done();
    });

    it('createPemFiles - runs command and files', (done) => {
      utils.createPemFiles(config.certs.p12, config.certs.passphrase, tempDir).then((res) => {
        assert(res);
        done();
      }).catch((err) => {
        done(err);
      });
    });

    xit('should execute cert command', (done) => {
      let _done = _.after(cmds.length, () => {
        done();
      });
      _.forEach(cmds, (cmd) => {
        assert(cmd);
        utils.exec(cmd.cmd).then((resp) => {
          assert(resp);
          assert(fs.existsSync(cmd.filename), 'creates filename');
          _done();
        }).catch((err) => {
          done(err);
        });
      });
    });

  });

  it('createPassAssets - should copy files to dest and resolve', (done) => {
    utils.createPassAssets('test-pass', 'generic', `${tempDir}`).then((resp) => {
      assert(resp);
      //  console.log('resp', resp);
      done();
    });
  });



  describe('pem', () => {
    it('readPkcs12 - should read cert', (done) => {
      var p12Path = config.certs.p12;
      var options = {
        clientKeyPassword: config.certs.passphrase,
        p12Password: config.certs.passphrase
      };
      //console.log('pem', p12Path);
      pem.readPkcs12(p12Path, options, (resp) => {
        console.log(resp);
        done();
      });
    });
  });

});
