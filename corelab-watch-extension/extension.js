const vscode = require('vscode');
const { exec } = require('child_process');

function activate(context) {
  const root = 'C:\\DEV\\CROWN_CREATIVES';

  exec('node scripts/build-manifests.js', { cwd: root });
  exec('node scripts/build-sound-manifest.js', { cwd: root });

  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  status.text = '$(sync) Core Lab Watchers running';
  status.show();
  context.subscriptions.push(status);
}

function deactivate() {}

module.exports = { activate, deactivate };
