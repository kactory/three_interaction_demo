'use client'

import GUI from "lil-gui";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function OvalPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            // Scene 설정
            const scene = new THREE.Scene();
            scene.background = new THREE.Color("white");

            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
            });
            renderer.setSize(window.innerWidth, window.innerHeight);

            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            // 파라미터 객체 생성
            const params = {
                waveFrequency: 5,
                waveAmplitude: 0.1,
                waveSpeed: 0.05,
                rotationSpeed: 0.005,
                wireframe: false
            };

            // 구 생성
            const geometry = new THREE.SphereGeometry(1, 64, 64);
            const material = new THREE.MeshPhongMaterial({
                color: 0x00ff00,
                shininess: 100,
                wireframe: params.wireframe
            });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);

            // GUI 설정
            const gui = new GUI();
            gui.add(params, 'waveFrequency', 1, 20, 0.1).name('Wave Frequency');
            gui.add(params, 'waveAmplitude', 0, 0.5, 0.01).name('Wave Height');
            gui.add(params, 'waveSpeed', 0, 0.2, 0.01).name('Wave Speed');
            gui.add(params, 'rotationSpeed', 0, 0.02, 0.001).name('Rotation Speed');
            gui.add(params, 'wireframe').onChange((value: boolean) => {
                material.wireframe = value;
            }).name('Wireframe');

            // 조명 설정
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(1, 1, 2);
            scene.add(light);

            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);

            // 원본 버텍스 위치 저장
            const originalPositions = geometry.attributes.position.array.slice();

            // 애니메이션 함수
            let time = 0;
            const animate = () => {
                requestAnimationFrame(animate);
                time += params.waveSpeed;

                // 버텍스 위치 업데이트
                const positions = geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    const x = originalPositions[i];
                    const y = originalPositions[i + 1];
                    const z = originalPositions[i + 2];

                    const distance = Math.sqrt(x * x + y * y + z * z);
                    const theta = Math.acos(z / distance);
                    const phi = Math.atan2(y, x);

                    const wave = Math.sin(params.waveFrequency * phi + time) * params.waveAmplitude;
                    const newDistance = distance + wave;

                    positions[i] = newDistance * Math.sin(theta) * Math.cos(phi);
                    positions[i + 1] = newDistance * Math.sin(theta) * Math.sin(phi);
                    positions[i + 2] = newDistance * Math.cos(theta);
                }

                geometry.attributes.position.needsUpdate = true;
                sphere.rotation.y += params.rotationSpeed;

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
                gui.destroy();
            };
        }
    }, [canvasRef]);

    return (
        <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <canvas ref={canvasRef}></canvas>
        </main>
    );
}