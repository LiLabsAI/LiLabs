import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  labActions,
  vueLabState,
  type HoveredNeuron,
  type ProjectedCluster,
} from "../../store/labStore";

interface NeuronNode {
  id: number;
  layer: number;
  basePos: THREE.Vector3;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  phase: number;
  energy: number;
  colorType: 0 | 1 | 2 | 3; // 0=White, 1=Yellow, 2=Red, 3=Pink
}

interface SynapseEdge {
  from: number;
  to: number;
  layer: number;
}

interface SignalPulse {
  edgeIndex: number;
  t: number;
  speed: number;
  direction: 1 | -1;
  colorType: 0 | 1 | 2 | 3;
}

const PALETTE = [
  new THREE.Color(0xffffff), // 0: Crisp White
  new THREE.Color(0xfacc15), // 1: Signal Yellow
  new THREE.Color(0xef4444), // 2: Gradient Red
  new THREE.Color(0xec4899), // 3: Fine-Tune Pink
];

const PALETTE_HEX = ["#ffffff", "#facc15", "#ef4444", "#ec4899"];

function createMinimalLiWireCore(): THREE.Group {
  const group = new THREE.Group();

  const toWorld = (px: number, py: number): [number, number] => [
    (px - 74) * 0.015,
    (73 - py) * 0.015,
  ];

  const lShape = new THREE.Shape();
  const lPts: Array<[number, number]> = [
    toWorld(28, 25),
    toWorld(54, 25),
    toWorld(54, 97),
    toWorld(84, 97),
    toWorld(108, 121),
    toWorld(51, 121),
    toWorld(28, 98),
  ];
  lShape.moveTo(lPts[0][0], lPts[0][1]);
  for (let i = 1; i < lPts.length; i++) lShape.lineTo(lPts[i][0], lPts[i][1]);
  lShape.closePath();

  const iStem = new THREE.Shape();
  const stemPts: Array<[number, number]> = [
    toWorld(94, 58),
    toWorld(120, 58),
    toWorld(120, 121),
    toWorld(94, 95),
  ];
  iStem.moveTo(stemPts[0][0], stemPts[0][1]);
  for (let i = 1; i < stemPts.length; i++) iStem.lineTo(stemPts[i][0], stemPts[i][1]);
  iStem.closePath();

  const iDot = new THREE.Shape();
  const dotPts: Array<[number, number]> = [
    toWorld(94, 25),
    toWorld(120, 25),
    toWorld(120, 50),
    toWorld(94, 50),
  ];
  iDot.moveTo(dotPts[0][0], dotPts[0][1]);
  for (let i = 1; i < dotPts.length; i++) iDot.lineTo(dotPts[i][0], dotPts[i][1]);
  iDot.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.32,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  };

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.88,
  });

  const yellowDotMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
  });

  const whiteEdgeMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
  });

  [lShape, iStem].forEach((shape) => {
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.translate(0, 0, -0.16);
    const mesh = new THREE.Mesh(geom, darkMat);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geom, 15), whiteEdgeMat));
    group.add(mesh);
  });

  const dotGeom = new THREE.ExtrudeGeometry(iDot, extrudeSettings);
  dotGeom.translate(0, 0, -0.16);
  const dotMesh = new THREE.Mesh(dotGeom, yellowDotMat);
  dotMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(dotGeom, 15), whiteEdgeMat));
  group.add(dotMesh);

  return group;
}

function disposeObjectResources(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const candidate = obj as {
      geometry?: THREE.BufferGeometry;
      material?: THREE.Material | THREE.Material[];
    };
    candidate.geometry?.dispose();
    if (Array.isArray(candidate.material)) {
      for (const mat of candidate.material) {
        mat.dispose();
      }
    } else {
      candidate.material?.dispose();
    }
  });
}

export const NeuralForge3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webglFallback, setWebglFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglFallback(true);
      return;
    }
    renderer.setClearColor(0x040404, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040404, 0.038);

    const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 100);
    camera.position.set(0, 0.4, 13.2);

    // Minimalist Monochrome + Subtle Accent Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    // Multi-Plane Parallax Groups (add-mouse-driven-orbit skill)
    const rootGroup = new THREE.Group();
    const coreGroup = new THREE.Group();
    const outerHaloGroup = new THREE.Group();
    rootGroup.add(coreGroup);
    rootGroup.add(outerHaloGroup);
    scene.add(rootGroup);

    // Central Minimalist 3D "Li" Wireframe Core + Dual Gyroscopic Fine-Tuning Rings
    const liCore = createMinimalLiWireCore();
    liCore.scale.setScalar(0.92);
    coreGroup.add(liCore);

    const ringGeom1 = new THREE.TorusGeometry(1.75, 0.012, 12, 96);
    const ringMatWhite = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.32,
    });
    const ring1 = new THREE.Mesh(ringGeom1, ringMatWhite);
    ring1.rotation.x = Math.PI * 0.35;
    coreGroup.add(ring1);

    const ringGeom2 = new THREE.TorusGeometry(2.15, 0.012, 12, 96);
    const ringMatPink = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.38,
    });
    const ring2 = new THREE.Mesh(ringGeom2, ringMatPink);
    ring2.rotation.y = Math.PI * 0.28;
    coreGroup.add(ring2);

    const ringGeom3 = new THREE.TorusGeometry(2.55, 0.01, 12, 96);
    const ringMatYellow = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.28,
    });
    const ring3 = new THREE.Mesh(ringGeom3, ringMatYellow);
    ring3.rotation.x = -Math.PI * 0.22;
    ring3.rotation.z = Math.PI * 0.18;
    coreGroup.add(ring3);

    // Build 7-Layer 3D Neural Network Topology
    const layerX = [-6.2, -4.1, -2.1, 0.0, 2.1, 4.1, 6.2];
    const layerCounts = [20, 28, 34, 42, 34, 28, 20];
    const layerRadii = [1.85, 2.35, 2.65, 2.95, 2.65, 2.35, 1.85];

    const neurons: NeuronNode[] = [];
    const layerNodeIndices: number[][] = Array.from({ length: 7 }, () => []);

    let nodeId = 0;
    for (let l = 0; l < 7; l++) {
      const count = layerCounts[l];
      const radius = layerRadii[l];
      const xCenter = layerX[l];

      for (let i = 0; i < count; i++) {
        // Golden-angle spiral distribution on each layer cylinder/disc
        const frac = i / count;
        const theta = i * 2.399963229728653 + l * 0.6;
        const r = radius * (0.38 + 0.62 * Math.sqrt(frac));
        const xJitter = (Math.sin(i * 7.13 + l) * 0.38);
        const bx = xCenter + xJitter;
        const by = Math.cos(theta) * r * 0.78;
        const bz = Math.sin(theta) * r * 0.85;

        // Assign subtle accent affinity (mostly white, with yellow/red/pink specialist nodes)
        let colorType: 0 | 1 | 2 | 3 = 0;
        if (i % 9 === 0) colorType = 1; // Yellow
        else if (i % 11 === 0) colorType = 2; // Red
        else if (i % 7 === 0) colorType = 3; // Pink

        const basePos = new THREE.Vector3(bx, by, bz);
        neurons.push({
          id: nodeId,
          layer: l,
          basePos,
          pos: basePos.clone(),
          vel: new THREE.Vector3(),
          phase: i * 0.43 + l * 1.1,
          energy: colorType === 0 ? 0.15 : 0.65,
          colorType,
        });
        layerNodeIndices[l].push(nodeId);
        nodeId += 1;
      }
    }

    // Build Synaptic Connections between Adjacent & Skip Layers
    const edges: SynapseEdge[] = [];
    for (let l = 0; l < 6; l++) {
      const srcList = layerNodeIndices[l];
      const dstList = layerNodeIndices[l + 1];

      for (const sIdx of srcList) {
        const sNode = neurons[sIdx];
        // Connect each neuron to its 3 closest neurons in the next layer
        const ranked = dstList
          .map((dIdx) => ({
            dIdx,
            dist: sNode.basePos.distanceToSquared(neurons[dIdx].basePos),
          }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3);

        for (const r of ranked) {
          edges.push({ from: sIdx, to: r.dIdx, layer: l });
        }
      }

      // Intra-layer ring connections for structural cohesion
      for (let i = 0; i < srcList.length; i++) {
        edges.push({
          from: srcList[i],
          to: srcList[(i + 1) % srcList.length],
          layer: l,
        });
      }
    }

    // InstancedMesh for all 206 3D Neurons
    const neuronGeom = new THREE.IcosahedronGeometry(0.068, 2);
    const neuronMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const neuronInstanced = new THREE.InstancedMesh(neuronGeom, neuronMat, neurons.length);
    neuronInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    rootGroup.add(neuronInstanced);

    // Outer Wireframe Halo Shells on Key Attention/LoRA Neurons
    const haloIndices = neurons.filter((_, idx) => idx % 5 === 0).map((n) => n.id);
    const haloGeom = new THREE.OctahedronGeometry(0.145, 0);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const haloInstanced = new THREE.InstancedMesh(haloGeom, haloMat, haloIndices.length);
    haloInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    rootGroup.add(haloInstanced);

    // Dynamic Vertex-Colored LineSegments for all Synaptic Filaments
    const linePositions = new Float32Array(edges.length * 6);
    const lineColors = new Float32Array(edges.length * 6);
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeom.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
    });
    const synapseLines = new THREE.LineSegments(lineGeom, lineMat);
    rootGroup.add(synapseLines);

    // 140 Traveling Signal Pulses (White, Yellow, Red, Pink) gliding along synapses
    const pulseCount = 140;
    const pulses: SignalPulse[] = Array.from({ length: pulseCount }, (_, i) => ({
      edgeIndex: Math.floor((i * 19) % edges.length),
      t: (i * 0.17) % 1,
      speed: 0.45 + (i % 7) * 0.12,
      direction: i % 3 === 0 ? -1 : 1,
      colorType: i % 4 === 0 ? 1 : i % 5 === 0 ? 3 : i % 7 === 0 ? 2 : 0,
    }));

    const pulseGeom = new THREE.SphereGeometry(0.042, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulseInstanced = new THREE.InstancedMesh(pulseGeom, pulseMat, pulseCount);
    pulseInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let p = 0; p < pulseCount; p++) {
      pulseInstanced.setColorAt(p, PALETTE[pulses[p].colorType]);
    }
    if (pulseInstanced.instanceColor) {
      pulseInstanced.instanceColor.needsUpdate = true;
    }
    rootGroup.add(pulseInstanced);

    // Ambient Deep-Space Dust Field (minimalist monochrome depth cues)
    const dustCount = 220;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.sin(i * 12.9898) * 43758.5453 % 1) * 22 - 11;
      dustPos[i * 3 + 1] = (Math.cos(i * 78.233) * 23421.631 % 1) * 12 - 6;
      dustPos[i * 3 + 2] = (Math.sin(i * 39.346) * 19283.421 % 1) * 10 - 5;
    }
    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.032,
      transparent: true,
      opacity: 0.24,
    });
    const dustPoints = new THREE.Points(dustGeom, dustMat);
    outerHaloGroup.add(dustPoints);

    let isDisposed = false;
    let isDocumentHidden = typeof document !== "undefined" ? document.hidden : false;
    let contextLost = false;
    let needsWakeUntil = performance.now() + 400;
    let rafId = 0;

    const wakeRender = (durationMs = 450) => {
      needsWakeUntil = Math.max(needsWakeUntil, performance.now() + durationMs);
    };

    // Cached Viewport Size & Responsive Framing across ANY Monitor Size
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      viewport.width = Math.max(320, rect.width || window.innerWidth);
      viewport.height = Math.max(320, rect.height || window.innerHeight);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(viewport.width, viewport.height, false);

      const aspect = viewport.width / viewport.height;
      camera.aspect = aspect;
      // Automatically fit the full 7-layer horizontal span (-6.2..+6.2) on any aspect ratio
      const baseZ = aspect < 0.75 ? 22.5 : aspect < 1.2 ? 16.8 : aspect > 2.2 ? 11.4 : 13.0;
      camera.userData.baseZ = baseZ;
      camera.updateProjectionMatrix();
      wakeRender(250);
    };
    updateSize();

    // Smooth Mouse-Driven Orbit + Drag Rotation + Touch Pinch + Keyboard Navigation
    const pointer = {
      targetX: 0,
      targetY: 0,
      smoothX: 0,
      smoothY: 0,
      active: false,
      isDragging: false,
      lastClientX: 0,
      lastClientY: 0,
      dragYaw: 0,
      dragPitch: 0,
      zoomOffset: 0,
      worldCursor: new THREE.Vector3(0, 0, 0),
    };

    const activePointers = new Map<number, { x: number; y: number }>();
    let lastPinchDist: number | null = null;

    const raycaster = new THREE.Raycaster();
    const ndcVec = new THREE.Vector2();
    const intersectPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const clampPitch = (pitch: number) => Math.max(-0.65, Math.min(0.65, pitch));
    const clampZoom = (zoom: number) => Math.max(-4.5, Math.min(5.0, zoom));

    const resetDragState = () => {
      pointer.isDragging = false;
      activePointers.clear();
      lastPinchDist = null;
    };

    const dummy = new THREE.Object3D();
    const tempColor = new THREE.Color();
    const projVec = new THREE.Vector3();
    const projTopVec = new THREE.Vector3();
    const projBotVec = new THREE.Vector3();

    const clusterCache: ProjectedCluster[] = layerX.map((_, idx) => ({
      index: idx,
      x: 500,
      y: 500,
      topX: 500,
      topY: 400,
      bottomX: 500,
      bottomY: 600,
      scale: 1,
      energy: 0.25,
      accentHex: idx === 2 ? "#facc15" : idx === 3 ? "#ec4899" : idx === 4 ? "#ef4444" : "#ffffff",
    }));
    const prevProjX = new Float64Array(layerX.length);
    const prevProjY = new Float64Array(layerX.length);
    let prevPointerActive = false;
    let prevPointerX = -1;
    let prevPointerY = -1;
    let prevHoveredCount = -1;

    let lastTime = performance.now();
    let frameCount = 0;

    const scheduleFrame = () => {
      if (isDisposed || isDocumentHidden || contextLost || rafId !== 0) return;
      if (reducedMotion && performance.now() > needsWakeUntil) return;
      rafId = requestAnimationFrame(animate);
    };

    const animate = (now: number) => {
      rafId = 0;
      if (isDisposed || isDocumentHidden || contextLost) return;

      const rawDt = (now - lastTime) * 0.001;
      const dt = Math.min(1 / 30, Math.max(0.001, rawDt));
      lastTime = now;
      const t = now * 0.001;

      // Frame-rate-independent pointer damping (add-mouse-driven-orbit skill)
      const alpha = 1 - (1 - 0.055) ** (dt * 60);
      pointer.smoothX += (pointer.targetX - pointer.smoothX) * alpha;
      pointer.smoothY += (pointer.targetY - pointer.smoothY) * alpha;

      // Camera shallow arc + lookAt carry
      const baseZ = (camera.userData.baseZ as number) || 13.0;
      camera.position.x = -pointer.smoothX * 1.45;
      camera.position.y = pointer.smoothY * 0.95 + 0.2;
      camera.position.z += (baseZ + pointer.zoomOffset - camera.position.z) * 0.08;
      camera.lookAt(camera.position.x * 0.38, camera.position.y * 0.38, 0);

      // Opposing multi-layer rotations
      const targetYaw = pointer.dragYaw + pointer.smoothX * 0.24;
      const targetPitch = pointer.dragPitch + pointer.smoothY * 0.14;
      rootGroup.rotation.y += (targetYaw - rootGroup.rotation.y) * 0.09;
      rootGroup.rotation.x += (targetPitch - rootGroup.rotation.x) * 0.09;

      if (!reducedMotion) {
        coreGroup.rotation.y = t * 0.28 - pointer.smoothX * 0.18;
        coreGroup.rotation.z = Math.sin(t * 0.5) * 0.08;
        ring1.rotation.z = t * 0.45;
        ring2.rotation.x = -t * 0.38;
        ring3.rotation.y = t * 0.32;
        outerHaloGroup.rotation.y = -pointer.smoothX * 0.08 + t * 0.03;
      }

      // Compute 3D Cursor Intersection in rootGroup Local Space
      ndcVec.set(pointer.targetX, -pointer.targetY);
      raycaster.setFromCamera(ndcVec, camera);
      raycaster.ray.intersectPlane(intersectPlane, pointer.worldCursor);
      rootGroup.worldToLocal(pointer.worldCursor);

      // Fine-Tuning Wavefront from user click or periodic autonomous pulse
      const waveAgeSec = (now - vueLabState.pulseWaveTime) * 0.001;
      const activeWaveX = reducedMotion
        ? waveAgeSec < 1.8
          ? -7.0 + (waveAgeSec / 1.8) * 14.0
          : -999
        : waveAgeSec < 3.2
          ? -7.0 + (waveAgeSec / 3.2) * 14.0
          : -7.0 + ((t * 0.55) % 1) * 14.0;

      const mode = vueLabState.pulseMode;

      // Update 3D Neurons (magnetic cursor attraction + wave excitation)
      for (let i = 0; i < neurons.length; i++) {
        const n = neurons[i];

        const breatheX = reducedMotion ? 0 : Math.sin(t * 1.3 + n.phase) * 0.045;
        const breatheY = reducedMotion ? 0 : Math.cos(t * 1.1 + n.phase) * 0.055;
        const breatheZ = reducedMotion ? 0 : Math.sin(t * 0.9 + n.phase * 1.3) * 0.045;

        let tx = n.basePos.x + breatheX;
        let ty = n.basePos.y + breatheY;
        let tz = n.basePos.z + breatheZ;

        // Magnetic Cursor Interaction
        let cursorBoost = 0;
        if (pointer.active) {
          const dx = pointer.worldCursor.x - tx;
          const dy = pointer.worldCursor.y - ty;
          const dz = pointer.worldCursor.z - tz;
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < 6.25) {
            const dist = Math.sqrt(distSq);
            const pull = (1 - dist / 2.5) * 0.28;
            tx += dx * pull;
            ty += dy * pull;
            tz += dz * pull;
            cursorBoost = (1 - dist / 2.5) ** 1.5;
          }
        }

        n.pos.x += (tx - n.pos.x) * 0.14;
        n.pos.y += (ty - n.pos.y) * 0.14;
        n.pos.z += (tz - n.pos.z) * 0.14;

        // Wavefront excitation
        const waveDist = Math.abs(n.pos.x - activeWaveX);
        const waveBoost = waveDist < 1.6 ? (1 - waveDist / 1.6) ** 2 : 0;

        n.energy = Math.min(1, 0.15 + cursorBoost * 0.95 + waveBoost * 0.85);

        const scale = 0.72 + n.energy * 1.05;
        dummy.position.copy(n.pos);
        dummy.scale.setScalar(scale);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        neuronInstanced.setMatrixAt(i, dummy.matrix);

        if (cursorBoost > 0.32) {
          const cIdx = (i % 3) + 1;
          tempColor.copy(PALETTE[cIdx]);
        } else if (waveBoost > 0.35) {
          const cIdx =
            mode === "finetune"
              ? 1
              : mode === "synapse"
                ? 2
                : n.colorType === 0
                  ? 3
                  : n.colorType;
          tempColor.copy(PALETTE[cIdx]);
        } else if (n.colorType !== 0 && n.energy > 0.45) {
          tempColor.copy(PALETTE[n.colorType]);
        } else {
          const luma = 0.45 + n.energy * 0.55;
          tempColor.setRGB(luma, luma, luma);
        }
        neuronInstanced.setColorAt(i, tempColor);
      }
      neuronInstanced.instanceMatrix.needsUpdate = true;
      if (neuronInstanced.instanceColor) neuronInstanced.instanceColor.needsUpdate = true;

      // Update Wireframe Halo Octahedrons
      for (let h = 0; h < haloIndices.length; h++) {
        const n = neurons[haloIndices[h]];
        dummy.position.copy(n.pos);
        const hs = 0.8 + n.energy * 1.15;
        dummy.scale.setScalar(hs);
        dummy.rotation.set(t * 0.4 + h, t * 0.3, 0);
        dummy.updateMatrix();
        haloInstanced.setMatrixAt(h, dummy.matrix);
      }
      haloInstanced.instanceMatrix.needsUpdate = true;

      // Update Synaptic Line Positions & Vertex Colors
      const posAttr = lineGeom.getAttribute("position") as THREE.BufferAttribute;
      const colAttr = lineGeom.getAttribute("color") as THREE.BufferAttribute;

      for (let e = 0; e < edges.length; e++) {
        const edge = edges[e];
        const na = neurons[edge.from];
        const nb = neurons[edge.to];
        const base = e * 6;

        linePositions[base] = na.pos.x;
        linePositions[base + 1] = na.pos.y;
        linePositions[base + 2] = na.pos.z;
        linePositions[base + 3] = nb.pos.x;
        linePositions[base + 4] = nb.pos.y;
        linePositions[base + 5] = nb.pos.z;

        const pairEnergy = (na.energy + nb.energy) * 0.5;
        if (pairEnergy > 0.58) {
          const c =
            na.colorType !== 0
              ? PALETTE[na.colorType]
              : nb.colorType !== 0
                ? PALETTE[nb.colorType]
                : PALETTE[1];
          lineColors[base] = c.r * pairEnergy;
          lineColors[base + 1] = c.g * pairEnergy;
          lineColors[base + 2] = c.b * pairEnergy;
          lineColors[base + 3] = c.r * pairEnergy;
          lineColors[base + 4] = c.g * pairEnergy;
          lineColors[base + 5] = c.b * pairEnergy;
        } else {
          const gray = 0.14 + pairEnergy * 0.55;
          lineColors[base] = gray;
          lineColors[base + 1] = gray;
          lineColors[base + 2] = gray;
          lineColors[base + 3] = gray;
          lineColors[base + 4] = gray;
          lineColors[base + 5] = gray;
        }
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Update 140 Traveling Signal Photons along Synapses (static colors initialized once at setup)
      for (let p = 0; p < pulseCount; p++) {
        const pulse = pulses[p];
        if (!reducedMotion) {
          pulse.t += dt * pulse.speed * pulse.direction;
          if (pulse.t > 1) {
            pulse.t = 0;
            pulse.edgeIndex = (pulse.edgeIndex + 7) % edges.length;
          } else if (pulse.t < 0) {
            pulse.t = 1;
            pulse.edgeIndex = (pulse.edgeIndex + 13) % edges.length;
          }
        }

        const edge = edges[pulse.edgeIndex];
        const na = neurons[edge.from];
        const nb = neurons[edge.to];

        dummy.position.lerpVectors(na.pos, nb.pos, pulse.t);
        const s = 0.65 + (na.energy + nb.energy) * 0.45;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        pulseInstanced.setMatrixAt(p, dummy.matrix);
      }
      pulseInstanced.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      // Project 3D coordinates into Vue 3.5's 3D SVG Overlay every 2 frames
      frameCount += 1;
      if (frameCount % 2 === 0) {
        const toSvgX = (nx: number) => Number(((nx * 0.5 + 0.5) * 1000).toFixed(1));
        const toSvgY = (ny: number) => Number(((-ny * 0.5 + 0.5) * 1000).toFixed(1));

        const pSvgX = Number(((pointer.targetX * 0.5 + 0.5) * 1000).toFixed(1));
        const pSvgY = Number(((pointer.targetY * 0.5 + 0.5) * 1000).toFixed(1));
        let projDirty =
          pointer.active !== prevPointerActive ||
          Math.abs(pSvgX - prevPointerX) >= 0.25 ||
          Math.abs(pSvgY - prevPointerY) >= 0.25;

        for (let idx = 0; idx < layerX.length; idx++) {
          const lx = layerX[idx];
          projVec.set(lx, 0, 0);
          rootGroup.localToWorld(projVec);
          projVec.project(camera);

          projTopVec.set(lx, layerRadii[idx] * 0.72, 0);
          rootGroup.localToWorld(projTopVec);
          projTopVec.project(camera);

          projBotVec.set(lx, -layerRadii[idx] * 0.72, 0);
          rootGroup.localToWorld(projBotVec);
          projBotVec.project(camera);

          const waveDist = Math.abs(lx - activeWaveX);
          const energy = waveDist < 2.0 ? Math.max(0.2, 1 - waveDist / 2.0) : 0.25;

          const x = toSvgX(projVec.x);
          const y = toSvgY(projVec.y);
          if (
            Math.abs(x - prevProjX[idx]) >= 0.25 ||
            Math.abs(y - prevProjY[idx]) >= 0.25 ||
            Math.abs(energy - clusterCache[idx].energy) >= 0.03
          ) {
            projDirty = true;
          }
          prevProjX[idx] = x;
          prevProjY[idx] = y;

          const slot = clusterCache[idx];
          slot.x = x;
          slot.y = y;
          slot.topX = toSvgX(projTopVec.x);
          slot.topY = toSvgY(projTopVec.y);
          slot.bottomX = toSvgX(projBotVec.x);
          slot.bottomY = toSvgY(projBotVec.y);
          slot.energy = energy;
        }

        const hoveredNeurons: HoveredNeuron[] = [];
        if (pointer.active) {
          for (let i = 0; i < neurons.length; i += 2) {
            const n = neurons[i];
            projVec.copy(n.pos);
            rootGroup.localToWorld(projVec);
            projVec.project(camera);
            if (projVec.z > 1) continue;

            const sx = toSvgX(projVec.x);
            const sy = toSvgY(projVec.y);
            const dist = Math.hypot(sx - pSvgX, sy - pSvgY);
            if (dist < 145) {
              hoveredNeurons.push({
                id: n.id,
                x: sx,
                y: sy,
                dist,
                color: PALETTE_HEX[n.colorType === 0 ? (n.id % 3) + 1 : n.colorType],
              });
            }
          }
          hoveredNeurons.sort((a, b) => a.dist - b.dist);
        }

        const clippedHoverCount = Math.min(8, hoveredNeurons.length);
        if (projDirty || pointer.active || clippedHoverCount !== prevHoveredCount) {
          prevPointerActive = pointer.active;
          prevPointerX = pSvgX;
          prevPointerY = pSvgY;
          prevHoveredCount = clippedHoverCount;
          labActions.updateProjectionFrame(
            { x: pSvgX, y: pSvgY, active: pointer.active },
            clusterCache.map((c) => ({ ...c })),
            hoveredNeurons.slice(0, 8)
          );
        }
      }

      if (!reducedMotion || now < needsWakeUntil) {
        scheduleFrame();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / viewport.width) * 2 - 1;
      pointer.targetY = (e.clientY / viewport.height) * 2 - 1;
      pointer.active = true;

      if (activePointers.has(e.pointerId)) {
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (lastPinchDist !== null) {
          pointer.zoomOffset = clampZoom(pointer.zoomOffset + (lastPinchDist - dist) * 0.02);
        }
        lastPinchDist = dist;
        pointer.isDragging = false;
      } else if (pointer.isDragging) {
        const dx = e.clientX - pointer.lastClientX;
        const dy = e.clientY - pointer.lastClientY;
        pointer.lastClientX = e.clientX;
        pointer.lastClientY = e.clientY;
        pointer.dragYaw += dx * 0.0055;
        pointer.dragPitch = clampPitch(pointer.dragPitch + dy * 0.0045);
      }

      if (reducedMotion) {
        wakeRender(250);
        scheduleFrame();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try {
        canvas.setPointerCapture?.(e.pointerId);
      } catch {
        // Synthetic or unsupported pointer capture
      }

      if (activePointers.size === 1) {
        pointer.isDragging = true;
        pointer.lastClientX = e.clientX;
        pointer.lastClientY = e.clientY;
        pointer.active = true;
        labActions.triggerFineTuneWave();
        wakeRender(1800);
      } else {
        pointer.isDragging = false;
        lastPinchDist = null;
        wakeRender(300);
      }
      scheduleFrame();
    };

    const onPointerUp = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);
      lastPinchDist = null;
      if (activePointers.size === 0) {
        pointer.isDragging = false;
      }
      try {
        if (canvas.hasPointerCapture?.(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore capture release errors
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.targetX = 0;
      pointer.targetY = 0;
      resetDragState();
      if (reducedMotion) {
        wakeRender(250);
        scheduleFrame();
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      pointer.zoomOffset = clampZoom(pointer.zoomOffset + e.deltaY * 0.0045);
      wakeRender(300);
      scheduleFrame();
    };

    const onCanvasKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      let handled = true;
      if (e.key === "ArrowLeft") {
        pointer.dragYaw -= 0.14;
      } else if (e.key === "ArrowRight") {
        pointer.dragYaw += 0.14;
      } else if (e.key === "ArrowUp") {
        pointer.dragPitch = clampPitch(pointer.dragPitch - 0.1);
      } else if (e.key === "ArrowDown") {
        pointer.dragPitch = clampPitch(pointer.dragPitch + 0.1);
      } else if (e.key === "+" || e.key === "=") {
        pointer.zoomOffset = clampZoom(pointer.zoomOffset - 0.45);
      } else if (e.key === "-" || e.key === "_") {
        pointer.zoomOffset = clampZoom(pointer.zoomOffset + 0.45);
      } else if (e.key === " " || e.key === "Enter") {
        labActions.triggerFineTuneWave();
        wakeRender(1800);
      } else {
        handled = false;
      }

      if (handled) {
        e.preventDefault();
        wakeRender(350);
        scheduleFrame();
      }
    };

    const onVisibilityChange = () => {
      isDocumentHidden = document.hidden;
      if (isDocumentHidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        lastTime = performance.now();
        wakeRender(300);
        scheduleFrame();
      }
    };

    const onWindowBlur = () => {
      resetDragState();
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const onContextRestored = () => {
      contextLost = false;
      lastTime = performance.now();
      wakeRender(400);
      scheduleFrame();
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("keydown", onCanvasKeyDown);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    scheduleFrame();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("keydown", onCanvasKeyDown);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      disposeObjectResources(scene);
      renderer.dispose();
    };
  }, []);

  if (webglFallback) {
    return (
      <div
        data-webgl="fallback"
        className="fixed inset-0 w-screen h-dvh overflow-hidden bg-[#040404] select-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 48%, rgba(250, 204, 21, 0.08), rgba(236, 72, 153, 0.04) 28%, #040404 68%)",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-dvh overflow-hidden bg-[#040404] select-none"
    >
      <canvas
        ref={canvasRef}
        tabIndex={0}
        aria-label="Interactive 3D neural network showcase. Drag or use arrow keys to orbit, scroll to zoom, click or press Space to pulse."
        style={{ touchAction: "none" }}
        className="w-full h-full block cursor-crosshair active:cursor-grabbing touch-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#facc15]/60"
      />
    </div>
  );
};
