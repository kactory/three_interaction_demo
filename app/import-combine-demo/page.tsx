'use client'

import React, { useEffect } from "react";
import { MODEL_PATHS } from "../components/contants/models";
import useGameManager from "../hook/game-manager-hook";
import * as THREE from "three";

export default function ImportDemo() {
    const {
        canvasRef,
        scene,
        camera,
        controls,
        renderer,
        loadModel
    } = useGameManager();

    useEffect(() => {
        loadModel(
            MODEL_PATHS.OBJECTS.wall.path,
            new THREE.Vector3(0, 0, 0),
            new THREE.Euler(0, 0, 0),
            new THREE.Vector3(1, 1, 1)
        );

        loadModel(
            MODEL_PATHS.OBJECTS.wall.path,
            new THREE.Vector3(2.7, 0, 1.25),
            new THREE.Euler(0, 90, 0),
            new THREE.Vector3(1, 1, 1)
        );

        loadModel(
            MODEL_PATHS.OBJECTS.wall.path,
            new THREE.Vector3(2.7, 0, 5),
            new THREE.Euler(0, 90, 0),
            new THREE.Vector3(1, 1, 1)
        );

        loadModel(
            MODEL_PATHS.OBJECTS.wall.path,
            new THREE.Vector3(0, 0, 6.25),
            new THREE.Euler(0, 180, 0),
            new THREE.Vector3(1, 1, 1)
        );

        // 애니메이션 루프
        function animate() {
            requestAnimationFrame(animate);
            controls?.update();
            if (scene && camera && renderer) {
                renderer.render(scene, camera);
            }
        }
        animate();

        // 윈도우 리사이즈 대응
        const handleResize = () => {
            if (!camera || !renderer) return;

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
            renderer?.dispose();
        };
    }, [camera, controls, loadModel, renderer, scene]);

    return (
        <main className="w-screen h-screen overflow-hidden">
            <canvas ref={canvasRef} />
        </main>
    );
}