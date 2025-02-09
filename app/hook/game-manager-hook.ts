import { DRACOLoader, GLTF, GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

// GLTF 로더 결과 타입 정의
export type GLTFResult = GLTF & {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
};

const useGameManager = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scene, setScene] = useState<THREE.Scene>();
    const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
    const [controls, setControls] = useState<OrbitControls>();
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    useEffect(() => {
        initialize();
    }, []);

    // 게임 기본 환경 설정을 초기화
    const initialize = async () => {
        if (!canvasRef.current) return;
        // Scene 설정
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        setScene(scene);

        // Renderer 설정
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        setRenderer(renderer);

        // Camera 설정
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 2, 5);
        setCamera(camera);

        // Controls 설정
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        setControls(controls);

        // 조명 설정
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
    }

    const loadModel = async (
        path: string,
        position?: THREE.Vector3,
        rotation?: THREE.Euler,
        scale?: THREE.Vector3
    ): Promise<THREE.Group> => {
        const gltf = new Promise((resolve, reject) => {
            loader.load(
                path,
                (gltf) => resolve(gltf as GLTFResult),
                (progress) => console.log((progress.loaded / progress.total * 100) + '%'),
                (error) => reject(error)
            );
        }) as Promise<GLTFResult>;

        const model = (await gltf).scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.set(
            -center.x + (position?.x || 0),
            -center.y + (position?.y || 0),
            -center.z + (position?.z || 0),
        );

        if (rotation) {
            model.rotation.set(
                rotation.x * Math.PI / 180,
                rotation.y * Math.PI / 180,
                rotation.z * Math.PI / 180
            );
        }

        if (scale) {
            model.scale.set(
                scale.x,
                scale.y,
                scale.z
            );
        }

        scene?.add(model);

        return model;
    };

    return {
        canvasRef,
        scene,
        camera,
        controls,
        renderer,
        loadModel
    }
}

export default useGameManager;