import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
const camera = new THREE.PerspectiveCamera(77, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 10);
scene.add(camera);

// 3. 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

// 4. 设置几何体材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// scene.add(cube);

// 5. 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 6. 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

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



scene.background = new THREE.Color(0xf0f0f0);
// 加载gltf
const gltfLoader = new GLTFLoader();

// gltfLoader.loadAsync("./gltf/1.gltf").then((gltf) => {
gltfLoader.loadAsync("./gltf/FocusS70LLS082119678_深圳龙岗区上海宝冶阿波罗人才安居项目-3栋-8层-初测_063_20230407144254_1.gltf").then((gltf) => {
  console.log('gltf-scene', gltf);
  const root = gltf.scene;
  setDoubleSide(root)
  scene.add(root);

  // compute the box that contains all the stuff
  // from root and below
  const box = new THREE.Box3().setFromObject(root);

  const boxSize = box.getSize(new THREE.Vector3()).length();
  const boxCenter = box.getCenter(new THREE.Vector3());

  // set the camera to frame the box
  frameArea(boxSize * 1, boxSize, boxCenter, camera);

  // update the Trackball controls to handle the new size
  controls.maxDistance = boxSize * 10;
  controls.target.copy(boxCenter);
  controls.update();
});

function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
  // compute a unit vector that points in the direction the camera is now
  // in the xz plane from the center of the box
  const direction = (new THREE.Vector3())
    .subVectors(camera.position, boxCenter)
    .multiply(new THREE.Vector3(1, 0, 1))
    .normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

function setDoubleSide(obj) {
  if (obj.isMesh) {
    obj.material.side = THREE.DoubleSide;
  }

  if (obj.children && obj.children.length > 0) {
    obj.children.forEach(item => {
      setDoubleSide(item)
    })
  }
}

{
  const color = 0xFFFFFF;
  const intensity = 0.8;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(5, 10, 2);
  scene.add(light);
  scene.add(light.target);
}
