import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";


// 目标：认识shader

//创建gui对象
const gui = new dat.GUI();

// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(5, 5, 5);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// 点几何体
const geometry = new THREE.BufferGeometry();
const positionArray = new Float32Array([0, 0, 0]);
geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));


// 点材质
// const material = new THREE.PointsMaterial({
//   color: 0xffff00,
//   size: 5,
//   sizeAttenuation: true, // 指定点的大小是否因相机深度而衰减。（仅限透视摄像头。）默认为true。
// });

// 导入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/particles/10.png');


// 着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uTexture: {
      value: texture
    },
  },
  transparent: true
})

const point = new THREE.Points(geometry, shaderMaterial);
scene.add(point);



// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 将渲染器添加到body
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;

const clock = new THREE.Clock();
function animate(t) {
  controls.update();
  const elapsedTime = clock.getElapsedTime();
  // shaderMaterial.uniforms.uTime.value = elapsedTime;
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();