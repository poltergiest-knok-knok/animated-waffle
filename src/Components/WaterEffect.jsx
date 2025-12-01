import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    Vector2,
    Vector3,
    Scene,
    OrthographicCamera,
    Mesh,
    PlaneGeometry,
    ShaderMaterial,
    WebGLRenderTarget,
    FloatType,
    LinearFilter,
    Color
} from 'three';

// --- Shaders ---

const simVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const simFragmentShader = `
  varying vec2 vUv;
  uniform sampler2D tOld;
  uniform vec2 uDelta;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  uniform float uTime;

  // Physics Parameters
  // F: Damping (0.02 = waves die out reasonably fast to avoid clutter)
  // K: Spring Constant (0.04 = moderate speed)
  float F = 0.02; 
  float K = 0.04; 

  void main() {
    vec4 oldState = texture2D(tOld, vUv);
    float oldHeight = oldState.r;
    float oldVelocity = oldState.g;

    float N = texture2D(tOld, vUv + vec2(0.0, uDelta.y)).r;
    float S = texture2D(tOld, vUv - vec2(0.0, uDelta.y)).r;
    float E = texture2D(tOld, vUv + vec2(uDelta.x, 0.0)).r;
    float W = texture2D(tOld, vUv - vec2(uDelta.x, 0.0)).r;

    float laplacian = (N + S + E + W - 4.0 * oldHeight);

    float force = K * laplacian - F * oldVelocity;
    float newVelocity = oldVelocity + force;
    float newHeight = oldHeight + newVelocity;

    // Mouse interaction
    float mouseDist = distance(vUv, uMouse);
    float maxDist = 0.025; // Small, sharp brush (Stone/Finger tip)
    if (uMouseActive > 0.5 && mouseDist < maxDist) {
      float falloff = (1.0 - smoothstep(0.0, maxDist, mouseDist));
      newHeight -= falloff * 0.5; // Strong, sharp push
    }
    
    newHeight = clamp(newHeight, -2.0, 2.0);

    gl_FragColor = vec4(newHeight, newVelocity, 0.0, 1.0);
  }
`;

const renderVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform sampler2D tWater;
  uniform vec2 uDelta;

  void main() {
    vUv = uv;
    
    float height = texture2D(tWater, vUv).r;
    
    float hN = texture2D(tWater, vUv + vec2(0.0, uDelta.y)).r;
    float hS = texture2D(tWater, vUv - vec2(0.0, uDelta.y)).r;
    float hE = texture2D(tWater, vUv + vec2(uDelta.x, 0.0)).r;
    float hW = texture2D(tWater, vUv - vec2(uDelta.x, 0.0)).r;

    // Calculate normals
    vec3 normal = normalize(vec3((hW - hE) * 3.0, (hS - hN) * 3.0, 1.0));
    vNormal = normal;

    vec4 modelViewPosition = modelViewMatrix * vec4(position + vec3(0.0, 0.0, height * 0.05), 1.0);
    vViewPosition = -modelViewPosition.xyz;
    gl_Position = projectionMatrix * modelViewPosition;
  }
`;

const renderFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform sampler2D tWater;
  uniform vec3 uLightPos;
  uniform vec3 uLightColor;
  uniform float uShininess;

  void main() {
    vec3 normal = normalize(vNormal);
    
    // 1. Edge Detection (Slope)
    // STRICTLY detect changes in surface angle
    float slope = 1.0 - normal.z;
    
    // Very narrow smoothstep for SHARP lines
    float edge = smoothstep(0.005, 0.02, slope); 
    
    // 2. Specular Highlight
    vec3 viewDir = normalize(vViewPosition);
    vec3 lightDir = normalize(vec3(-1.0, 1.0, 1.0));
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 30.0); // Sharp highlight
    
    // Combine: Only show Edges and Highlights. NO BODY.
    float alpha = edge + spec;
    
    // Boost alpha slightly but keep it clamped
    alpha = clamp(alpha * 1.5, 0.0, 1.0);
    
    // Pure White for Difference Blending
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

// --- Component ---

function WaterRipples() {
    const { gl, size, viewport } = useThree();

    // Resolution: 512 is good for sharpness
    const resolution = useMemo(() => new Vector2(512, 512), []);
    const delta = useMemo(() => new Vector2(1 / resolution.x, 1 / resolution.y), [resolution]);

    const fboRef = useRef({
        read: new WebGLRenderTarget(resolution.x, resolution.y, { type: FloatType, minFilter: LinearFilter, magFilter: LinearFilter }),
        write: new WebGLRenderTarget(resolution.x, resolution.y, { type: FloatType, minFilter: LinearFilter, magFilter: LinearFilter }),
        swap: () => {
            let temp = fboRef.current.read;
            fboRef.current.read = fboRef.current.write;
            fboRef.current.write = temp;
        }
    });

    const simMaterial = useMemo(() => new ShaderMaterial({
        vertexShader: simVertexShader,
        fragmentShader: simFragmentShader,
        uniforms: {
            tOld: { value: null },
            uDelta: { value: delta },
            uMouse: { value: new Vector2(-1, -1) },
            uMouseActive: { value: 0.0 },
            uTime: { value: 0.0 }
        }
    }), [delta]);

    const renderMaterialRef = useRef();
    const renderUniforms = useMemo(() => ({
        tWater: { value: fboRef.current.read.texture },
        uDelta: { value: delta },
        uLightPos: { value: new Vector3(2.0, 2.0, 2.0) },
        uLightColor: { value: new Vector3(1.0, 1.0, 1.0) },
        uShininess: { value: 50.0 }
    }), [delta]);

    const simScene = useMemo(() => new Scene(), []);
    const simCamera = useMemo(() => new OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
    const simQuad = useMemo(() => new Mesh(new PlaneGeometry(2, 2), simMaterial), [simMaterial]);
    simScene.add(simQuad);

    // Global mouse tracking
    const mouseRef = useRef(new Vector2(-1, -1));
    const mouseActiveRef = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = 1.0 - (e.clientY / window.innerHeight);
            mouseRef.current.set(x, y);
            mouseActiveRef.current = true;
        };

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                const x = e.touches[0].clientX / window.innerWidth;
                const y = 1.0 - (e.touches[0].clientY / window.innerHeight);
                mouseRef.current.set(x, y);
                mouseActiveRef.current = true;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    useEffect(() => {
        gl.setRenderTarget(fboRef.current.read);
        gl.clear();
        gl.setRenderTarget(fboRef.current.write);
        gl.clear();
        gl.setRenderTarget(null);
    }, [gl]);

    useFrame((state, delta) => {
        const { gl, clock } = state;
        simMaterial.uniforms.uTime.value = clock.elapsedTime;

        simMaterial.uniforms.uMouse.value.copy(mouseRef.current);
        simMaterial.uniforms.uMouseActive.value = mouseActiveRef.current ? 1.0 : 0.0;

        // --- Simulation Pass ---
        simMaterial.uniforms.tOld.value = fboRef.current.read.texture;
        gl.setRenderTarget(fboRef.current.write);
        gl.render(simScene, simCamera);
        gl.setRenderTarget(null);
        fboRef.current.swap();

        // --- Update Display Material ---
        if (renderMaterialRef.current) {
            renderMaterialRef.current.uniforms.tWater.value = fboRef.current.read.texture;
        }
    });

    return (
        <mesh>
            <planeGeometry args={[viewport.width, viewport.height]} />
            <shaderMaterial
                ref={renderMaterialRef}
                vertexShader={renderVertexShader}
                fragmentShader={renderFragmentShader}
                uniforms={renderUniforms}
                transparent={true}
            />
        </mesh>
    );
}

export default function WaterEffect() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none',
            mixBlendMode: 'difference' // Inverts colors where ripples are
        }}>
            <Canvas
                orthographic
                camera={{ position: [0, 0, 1], near: 0, far: 10, zoom: 1 }}
                dpr={[1, 2]}
                style={{ pointerEvents: 'none' }}
                gl={{ alpha: true }}
            >
                <WaterRipples />
            </Canvas>
        </div>
    );
}
