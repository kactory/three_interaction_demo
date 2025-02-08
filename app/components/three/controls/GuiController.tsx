import GUI from 'lil-gui';

let gui: GUI | null = null;

export const getGui = () => {
    if (!gui) {
        gui = new GUI();
    }
    return gui;
};

export const destroyGui = () => {
    if (gui) {
        gui.destroy();
        gui = null;
    }
};