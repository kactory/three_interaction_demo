import { DRACOLoader, GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
// GLTF 로더 결과 타입 정의
export type GLTFResult = GLTF & {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
};

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export const loadModel = (path: string): Promise<GLTFResult> => {
    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf) => resolve(gltf as GLTFResult),
            (progress) => console.log((progress.loaded / progress.total * 100) + '%'),
            (error) => reject(error)
        );
    });
};