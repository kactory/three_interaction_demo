'use client'

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Oval() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            // Scene 설정
            const scene = new THREE.Scene();
            scene.background = new THREE.Color("white");

            // Renderer 설정
            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
            });
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Camera 설정
            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            camera.position.z = 5;

            // Cube 생성
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            // 조명 추가
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 0, 2);
            scene.add(light);

            // 애니메이션 함수
            const animate = () => {
                requestAnimationFrame(animate);
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                renderer.render(scene, camera);
            };

            // 윈도우 리사이즈 대응
            const handleResize = () => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            };

            window.addEventListener('resize', handleResize);
            animate();

            // 클린업
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [canvasRef]);

    return (
        <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <canvas ref={canvasRef}></canvas>
        </main>
    );
}