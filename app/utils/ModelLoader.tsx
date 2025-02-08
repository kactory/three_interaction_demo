import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";


const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export const loadModel = (path: string) => {
    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf) => {
                console.log(gltf);
                resolve(gltf);
            },
            (progress) => console.log((progress.loaded / progress.total * 100) + '%'),
            (error) => reject(error)
        );
    });
};