import {Ssh} from '@nexim/script-toolkit';

const ssh = new Ssh({
  user: 'root',
  host: 'srvo.njfamirm.ir',
  port: 404,
  // debug: true,
});

async function main() {
  await ssh.exec('rm -rf /tmp/dist/');
  await ssh.upload('./dist', '/tmp/');
}

main();
