import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';


// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
const camera = new THREE.PerspectiveCamera(77, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
scene.add(camera);

// 3. 创建几何体

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("./textures/particles/1.png");



// 目标， 运用数学知识设计特定形状的星系
const params = {
  count: 10000,  // 点的数量
  size: 0.1,     // 点的大小 
  radius: 5,     // 旋转半径
  branch: 6,     // 整体分支
  color: "#ff6030", // 中心颜色
  rotateScale: 0.3,  // 旋转系数？
  endColor: "#1b54e1", // 边缘颜色
};

let geometry = null;
let material = null;
let points = null;
const centerColor = new THREE.Color(params.color);
const endColor = new THREE.Color(params.endColor);

const generateGalaxy = () => {
  // 生成顶点
  geometry = new THREE.BufferGeometry();
  //   随机生成位置和
  const positions = new Float32Array(params.count * 3);
  // 设置顶点颜色
  const colors = new Float32Array(params.count * 3);

  //   循环生成点
  for (let i = 0; i < params.count; i++) {
    // 每个分支的夹角
    const branch = i % params.branch;
    const branchAngle = 2 * Math.PI / params.branch * branch;
    // 在半径在随机一个距离
    const distance = params.radius * Math.random();
    // 让点更集中原点
    // const distance = params.radius * Math.random() * Math.pow(Math.random(), 3);

    // 添加上下波动，围绕分支线
    // Math.random() * 2 - 1哪就是 1到-1之间随机
    // 开立方，是让随机点更靠中间聚拢
    // const randomX = Math.pow(Math.random() * 2 - 1, 3)
    // const randomY = Math.pow(Math.random() * 2 - 1, 3)
    // const randomZ = Math.pow(Math.random() * 2 - 1, 3)

    // * (params.radius - distance) 离原点远的点， 随机的范围更小，向中间聚拢
    const randomX = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
    const randomY = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5
    const randomZ = Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance) / 5

    // 通过三角函数，求得当前分支点的坐标
    // const x = Math.cos(branchAngle) * distance;
    // 添加旋转系数
    const x = Math.cos(branchAngle + distance * params.rotateScale) * distance + randomX;
    const y = 0 + randomY;
    // const z = Math.sin(branchAngle) * distance;
    // // 添加旋转系数
    const z = Math.sin(branchAngle + distance * params.rotateScale) * distance + randomZ;


    const current = i * 3;

    positions[current] = x;
    positions[current + 1] = y;
    positions[current + 2] = z;


    // 混合颜色，形成渐变色
    const mixColor = centerColor.clone();
    mixColor.lerp(endColor, distance / params.radius);

    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;
  }




  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  console.log(geometry)
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  //   设置点材质
  material = new THREE.PointsMaterial({
    color: new THREE.Color(params.color),   // 使用顶点颜色就不需要设置了
    size: params.size,  // 设置点的大小。默认值为1.0
    sizeAttenuation: true,  // 指定点的大小是否因相机深度而衰减
    depthWrite: false,      // 渲染此材质是否对深度缓冲区有任何影响。默认为true。
    blending: THREE.AdditiveBlending, // 在使用此材质显示对象时要使用何种混合
    map: particlesTexture,       // 使用来自Texture的数据设置点的颜色。可以选择包括一个alpha通道，通常与 .transparent或.alphaTest
    alphaMap: particlesTexture,  // 用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）
    transparent: true,  // 是否透明
    vertexColors: true, // 是否使用顶点着色
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};
generateGalaxy();




// // 4. 设置几何体材质




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


