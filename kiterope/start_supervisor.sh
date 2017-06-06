#!/usr/bin/env bash
virtualenv -p /usr/bin/python2.7 /tmp/senv
source /tmp/senv/bin/activate
sudo pip install supervisor
sudo /usr/local/bin/supervisord -c /opt/python/current/app/kiterope/supervisord.conf
supervisorctl -c /opt/python/current/app/kiterope/supervisord.conf status