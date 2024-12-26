import {packageTracer} from '@alwatr/package-tracer';
import {Ssh} from '@nexim/script-toolkit';

__dev_mode__: packageTracer.add(__package_name__, __package_version__);

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
