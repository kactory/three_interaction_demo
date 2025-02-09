'use client'

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { MODEL_PATHS } from "../components/contants/models";
import { loadModel } from "../utils/ModelLoader";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function ImportDemo() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene 설정
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        // Renderer 설정
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // Camera 설정
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 2, 5);

        // Controls 설정
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // 조명 설정
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // 모델 로드
        loadModel(MODEL_PATHS.OBJECTS.tables.path)
            .then((gltf) => {
                try {
                    const model = gltf.scene;
                    console.log(model);

                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());

                    model.position.set(-center.x, -center.y, -center.z);

                    // 격자로부터 모델의 위치를 표시해주는 선 헬퍼인 듯
                    const axesHelper = new THREE.AxesHelper(5);
                    // 격자 헬퍼
                    const gridHelper = new THREE.GridHelper(10, 10);

                    scene.add(axesHelper);
                    scene.add(gridHelper);
                    scene.add(model);

                    // 카메라 위치 자동 조정
                    const modelBox = new THREE.Box3().setFromObject(model);
                    const modelSize = modelBox.getSize(new THREE.Vector3());
                    const modelCenter = modelBox.getCenter(new THREE.Vector3());

                    // x, y, z 중 가장 큰 값을 찾아서 카메라의 깊이를 계산
                    const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
                    // 카메라의 FOV(Field of View)를 도(degree)에서 라디안으로 변환
                    const fov = camera.fov * (Math.PI / 180);
                    // 카메라의 깊이를 계산
                    const cameraZ = Math.abs(maxDim / Math.tan(fov / 2)) * 2;

                    camera.position.set(
                        modelCenter.x,
                        modelCenter.y + (modelSize.y / 2),
                        modelCenter.z + cameraZ
                    );

                    camera.lookAt(modelCenter);

                    // 컨트롤 타겟을 모델 중심으로
                    controls.target.copy(modelCenter);
                    controls.update();

                } catch (error) {
                    console.error('Error setting up model:', error);
                }
            })
            .catch((error) => {
                console.error('Error loading model:', error);
            });

        // 애니메이션 루프
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // 윈도우 리사이즈 대응
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // 클린업
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    return (
        <main className="w-screen h-screen overflow-hidden">
            <canvas ref={canvasRef} />
        </main>
    );
}