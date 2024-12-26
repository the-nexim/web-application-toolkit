import {createLogger} from '@alwatr/logger';
import {$} from 'zx';

const $$ = $({
  verbose: true,
});

import {execAsyncProcess} from './exec-promise-process.js';

export interface SSHConfig {
  host: string;
  user: string;
  port?: number;
  debug?: boolean;
  privateKey?: string;
  strictHostKeyChecking?: boolean;
}

export class Ssh {
  protected remoteAddress_;

  protected logger_;

  protected config_;

  constructor(config: SSHConfig) {
    this.logger_ = createLogger(`${__package_name__}:ssh`);
    this.config_ = config;

    this.logger_.logMethodArgs?.('constructor', {config});

    this.remoteAddress_ = `${this.config_.user}@${this.config_.host}`;
  }

  protected buildSshArgs_(remoteCommand: string): string[] {
    const args = [];

    args.push(this.remoteAddress_);
    if (this.config_.port) {
      args.push('-p', this.config_.port.toString());
    }

    if (this.config_.privateKey) {
      args.push('-i', this.config_.privateKey);
    }

    if (this.config_.strictHostKeyChecking) {
      args.push('-o', 'StrictHostKeyChecking=yes');
    }

    if (this.config_.debug) {
      args.push('-vvv');
    }

    args.push(remoteCommand);

    this.logger_.logMethodFull?.('buildSshArgs_', {remoteCommand}, args);

    return args;
  }

  exec(remoteCommand: string): Promise<void> {
    this.logger_.logMethodArgs?.('exec', {remoteCommand});

    const args = this.buildSshArgs_(remoteCommand);

    this.logger_.logMethodArgs?.('exec', {remoteCommand});
    return execAsyncProcess('ssh', args);
  }

  async version(): Promise<void> {
    await $$`ssh -V`;
  }

  protected buildRsyncArgs_(localPath: string, remotePath: string): string[] {
    this.logger_.logMethodArgs?.('upload', {localPath, remotePath});

    const remoteFullPath = `${this.remoteAddress_}:${remotePath}`;
    const args = ['-avz']; // Archive mode, verbose, compress

    let sshCommand = 'ssh';
    if (this.config_.port) {
      sshCommand += ` -p ${this.config_.port}`;
    }
    if (this.config_.privateKey) {
      sshCommand += ` -i ${this.config_.privateKey}`;
    }

    args.push('-e', sshCommand, localPath, remoteFullPath);
    return args;
  }

  upload(localPath: string, remotePath: string): Promise<void> {
    const args = this.buildRsyncArgs_(localPath, remotePath);

    this.logger_.logMethodArgs?.('upload', {localPath, remotePath});
    return execAsyncProcess('rsync', args);
  }
}
