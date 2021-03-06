const { contextBridge, ipcRenderer } = require('electron');
const { preloadBindings } = require('../../libs/i18next-electron-fs-backend');

contextBridge.exposeInMainWorld('i18n', {
  i18nextElectronBackend: preloadBindings(ipcRenderer),
});

window.addEventListener(
  'message',
  event => {
    console.log(event)
  },
  false,
);