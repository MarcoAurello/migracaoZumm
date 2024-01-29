const cmd = require('node-cmd')

// pm2 start  startscript --name "NomeDaAplicacao" --exp-backoff-restart-delay=100

cmd.run('yarn run production')
