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
            // 1. 형상(Geometry) 정의
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            // 파라미터: (반지름, 수평 분할 수, 수직 분할 수)
            // - 1: 구의 반지름
            // - 32: 가로 방향 분할 수 (더 많을수록 더 부드러운 구)
            // - 32: 세로 방향 분할 수 (더 많을수록 더 부드러운 구)

            // 2. 재질(Material) 정의
            const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
            // MeshPhongMaterial: 빛을 받아 반사하는 광택 있는 재질
            // 0x00ff00: 초록색 (RGB: 00 FF 00)

            // 3. 메시(Mesh) 생성 - 형상과 재질을 결합
            const sphere = new THREE.Mesh(geometry, material);
            // Mesh는 형상(geometry)과 재질(material)을 결합한 실제 3D 객체

            // 4. 씬에 추가
            scene.add(sphere);
            // 생성된 메시를 3D 씬에 추가

            // 조명 추가
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 0, 2);
            scene.add(light);

            // 애니메이션 함수
            const animate = () => {
                requestAnimationFrame(animate);
                sphere.rotation.x += 0.01;
                sphere.rotation.y += 0.01;
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