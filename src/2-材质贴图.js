import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap';
import * as dat from 'dat.gui';


// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
const camera = new THREE.PerspectiveCamera(77, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2);
scene.add(camera);

// 3. 创建几何体

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);

const onLoadFn = function () {
  console.log("图片加载完成");
};
const onProgressFn = function (url, num, total) {
  console.log("图片加载完成:", url);
  console.log("图片加载进度:", num);
  console.log("图片总数:", total);
  let value = ((num / total) * 100).toFixed(2) + "%";
  console.log("加载进度的百分比：", value);
};
const onErrorFn = function (e) {
  console.log("图片加载出现错误");
  console.log(e);
};

// 设置加载管理器
const loadingManager = new THREE.LoadingManager(
  onLoadFn,
  onProgressFn,
  onErrorFn
);
// 
const textureLoader = new THREE.TextureLoader(loadingManager);
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAplhaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAoTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
//导入置换贴图
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
// 导入粗糙度贴图
const roughnessTexture = textureLoader.load("./textures/door/roughness.jpg");
// 导入金属贴图
const metalnessTexture = textureLoader.load("./textures/door/metalness.jpg");
// 导入法线贴图
const normalTexture = textureLoader.load("./textures/door/normal.jpg");


// 4. 设置几何体材质
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  map: doorColorTexture,
  alphaMap: doorAplhaTexture,
  aoMap: doorAoTexture,
  aoMapIntensity: 1,
  transparent: true,
  // opacity: 0.6,
  side: THREE.DoubleSide,
  displacementMap: doorHeightTexture,
  displacementScale: 0.05,
  roughness: 1,
  roughnessMap: roughnessTexture,
  metalness: 1,
  metalnessMap: metalnessTexture,
  normalMap: normalTexture,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube);

// 给cube添加第二组uv
cubeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
);

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const plane = new THREE.Mesh(planeGeometry, cubeMaterial);
plane.position.set(3, 0, 0);

scene.add(plane);
// console.log(plane);
// 给平面设置第二组uv
planeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);

// 5. 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

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
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);


