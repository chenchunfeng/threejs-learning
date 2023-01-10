import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from 'gsap';
import * as dat from 'dat.gui';


// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
const camera = new THREE.PerspectiveCamera(77, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
scene.add(camera);

// 3. 创建几何体

const sphereGeometry = new THREE.SphereGeometry(3, 30, 30)

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("./textures/particles/2.png");



// 4. 设置几何体材质
const pointsMaterial = new THREE.PointsMaterial();
pointsMaterial.size = 0.1;
pointsMaterial.color = new THREE.Color(0xfff000);
pointsMaterial.map = particlesTexture;
pointsMaterial.alphaMap = particlesTexture;
pointsMaterial.transparent = true;
pointsMaterial.depthWrite = false;
// 叠加算法
pointsMaterial.blending = THREE.AdditiveBlending;

// 指定点的大小是否因相机深度而衰减 false就一样大  true 近大远小
pointsMaterial.sizeAttenuation = true;


const points = new THREE.Points(sphereGeometry, pointsMaterial);
scene.add(points);



// 5. 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;


// 6. 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;
// 7. 挂载页面
document.body.appendChild(renderer.domElement);

// 8. 循环显示
function render(time) {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

// 10 辅助坐标轴
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 11 动画




// 12 自适应屏幕
window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix()

  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //  设置渲染器的像素比
  renderer.setPixelRatio = window.devicePixelRatio;
})

// 13 全屏操作
window.addEventListener('dblclick', () => {
  const fullScreenElement = document.fullscreenElement;
  if (fullScreenElement) {
    document.exitFullscreen();
  } else {
    renderer.domElement.requestFullscreen();
  }
})

//  gui工具
const gui = new dat.GUI();


// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
scene.add(light);
//直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
// 设置阴影贴图模糊度
directionalLight.shadow.radius = 20;
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);


