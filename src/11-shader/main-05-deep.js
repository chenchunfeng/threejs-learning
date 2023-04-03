import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

// 顶点着色器
import basicVertexShader from "./shader/deep/vertex.glsl";
// 片元着色器
import basicFragmentShader from "./shader/deep/fragment.glsl";

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
camera.position.set(0, 0, 2);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// const material = new THREE.MeshBasicMaterial({ color: "#00ff00" });
// 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./textures/textures/ca.jpeg");


const params = {
  uFrequency: 10,
  uScale: 0.1,
};

// 创建着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    myColor: {
      value: new THREE.Color('#00ff00')
    },
    uTime: {
      value: 0,
    },
    uTexture: {
      value: texture,
    },
    // 波浪的幅度
    uScale: {
      value: params.uScale,
    },
    // 波浪的频率
    uFrequency: {
      value: params.uFrequency,
    },

  },
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  side: THREE.DoubleSide,
  transparent: true
});

// 创建平面
const plane = new THREE.PlaneGeometry(1, 1, 64, 64);
console.log(plane)
const floor = new THREE.Mesh(
  plane,
  shaderMaterial
);

console.log(floor);
scene.add(floor);

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
// 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock();
function animate(t) {
  const elapsedTime = clock.getElapsedTime();
  shaderMaterial.uniforms.uTime.value = elapsedTime;
  //   console.log(elapsedTime);
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();


gui
  .add(params, "uFrequency")
  .min(0)
  .max(50)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uFrequency.value = value;
  });
gui
  .add(params, "uScale")
  .min(0)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uScale.value = value;
  });
