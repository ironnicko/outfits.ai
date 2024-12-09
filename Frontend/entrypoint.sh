#!/bin/sh
cd /home/ec2-user

env | grep ^VITE_ | sed 's/^VITE_//' > .env.production.local

yarn run preview