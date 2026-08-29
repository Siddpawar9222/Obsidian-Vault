class setStartupZoom {
    async invoke() {
        const electron = (typeof window.require === 'function') ? window.require('electron') : null;
        electron?.webFrame?.setZoomFactor(1.1);
        app.vault.setConfig("baseFontSize", 16);
    }
}
