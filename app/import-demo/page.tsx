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

                    // 모델 크기 조정 (필요한 경우)
                    model.scale.set(
                        MODEL_PATHS.OBJECTS.tables.scale,
                        MODEL_PATHS.OBJECTS.tables.scale,
                        MODEL_PATHS.OBJECTS.tables.scale
                    );

                    // 모델을 씬에 추가
                    scene.add(model);

                    // 모델의 바운딩 박스 계산하여 카메라 위치 자동 조정
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());

                    const maxDim = Math.max(size.x, size.y, size.z);
                    const fov = camera.fov * (Math.PI / 180);
                    const cameraZ = Math.abs(maxDim / Math.tan(fov / 2));

                    camera.position.set(center.x, center.y + (size.y / 2), center.z + cameraZ);
                    camera.lookAt(center);

                    // 컨트롤 타겟을 모델 중심으로
                    controls.target.copy(center);
                    controls.update();
                } catch (error) {
                    console.error('Error loading model:', error);
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