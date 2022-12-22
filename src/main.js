import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap';
import * as dat from 'dat.gui';


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
scene.add(cube);

// 5. 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 6. 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 7. 挂载页面
document.body.appendChild(renderer.domElement);

// 8. 循环显示
function render(time) {
  // 移动
  // cube.position.x += 0.01;
  // if (cube.position.x > 5) {
  //   cube.position.x = 0;
  // }
  // 放大
  // cube.scale.set(2, 1, 1);
  // cube.scale.x = 2;
  // cube.scale.y = 0.5;
  // cube.scale.z = 0.5;
  // 旋转
  // cube.rotation.x += Math.PI / 180;

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
const animation = gsap.to(cube.position, {
  x: 5,
  delay: 1,
  duration: 5,
  yoyo: true,
  ease: 'power2.inOut',
  repeat: -1,
  onComplete() {
    console.log('complete')
  },
  onStart() {
    console.log('start');
  }
})

// 5秒旋转360度
gsap.to(cube.rotation, {
  x: 2 * Math.PI, duration: 5, ease: 'power2.inOut', repeat: -1, delay: 1,
});

window.addEventListener('dblclick', () => {
  if (animation.isActive()) {
    animation.pause();
  } else {
    animation.resume()
  }
})

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
const cameraRotationFn = function () {
  gsap.to(
    cube.position,
    { z: 5, duration: 5, ease: 'power2.inOut', repeat: 2, yoyo: true }
  )
}

gui.addColor(cube.material, 'color').name('颜色');
gui.add(cube.material, 'wireframe').name('是否线框');

const folder = gui.addFolder('立方体');
folder.add(cube.position, 'y', 0, 5, 0.1).name('Y轴');
folder.add(cube, 'visible').name('是否显示');
folder.add({ fn: cameraRotationFn }, 'fn').name('z轴移动');

