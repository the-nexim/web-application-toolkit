import {packageTracer} from '@alwatr/package-tracer';

__dev_mode__: packageTracer.add(__package_name__, __package_version__);

export * from '@nexim/eleventy-config';
export * from '@nexim/service-worker-notify';
export * from '@nexim/pwa-install-prompt';
