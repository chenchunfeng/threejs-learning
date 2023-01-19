import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from 'gsap';
import * as dat from 'dat.gui';


// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
const cameraGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera(77, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);
cameraGroup.add(camera);
scene.add(cameraGroup);
// 3. 创建几何体

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);


// 4. 设置几何体材质
const material = new THREE.MeshBasicMaterial({
  wireframe: true
})

const activeMaterial = new THREE.MeshBasicMaterial({
  color: "#ff0000",
});

let cubeGroup = new THREE.Group();
// 创建1000个立方体  10 * 10 * 10
let cubeArr = [];
for (let x = -5; x <= 5; x++) {
  for (let y = -5; y <= 5; y++) {
    for (let z = -5; z <= 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(x, y, z);
      cubeArr.push(cube);
      cubeGroup.add(cube);
    }
  }
}
scene.add(cubeGroup);

let zDistance = 35

// 创建三角形酷炫物体
// 添加物体
// 创建几何体
var triangleGroup = new THREE.Group();
for (let i = 0; i < 50; i++) {
  // 每一个三角形，需要3个顶点，每个顶点需要3个值
  const geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    // -5 到 5
    positionArray[j] = Math.random() * 10 - 5;
  }
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );
  let color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  // 根据几何体和材质创建物体
  let triangleMesh = new THREE.Mesh(geometry, material);
  //   console.log(mesh);
  triangleGroup.add(triangleMesh);
}
triangleGroup.position.set(0, -zDistance, 0);
scene.add(triangleGroup);

// 弹跳小球
const sphereGroup = new THREE.Group();
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const spherematerial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
});
const sphere = new THREE.Mesh(sphereGeometry, spherematerial);
// 投射阴影
sphere.castShadow = true;

sphereGroup.add(sphere);

// // 创建平面
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const plane = new THREE.Mesh(planeGeometry, spherematerial);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;
sphereGroup.add(plane);

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
sphereGroup.add(light);

const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
smallBall.position.set(2, 2, 2);
//直线光源
const pointLight = new THREE.PointLight(0xff0000, 3);
// pointLight.position.set(2, 2, 2);
pointLight.castShadow = true;

// 设置阴影贴图模糊度
pointLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(512, 512);

// 设置透视相机的属性
smallBall.add(pointLight);
sphereGroup.add(smallBall);

sphereGroup.position.set(0, -zDistance * 2, 0);
scene.add(sphereGroup);

let arrGroup = [cubeGroup, triangleGroup, sphereGroup];

// 5. 渲染器
const renderer = new THREE.WebGLRenderer({
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;


// 6. 添加轨道控制器
// const controls = new OrbitControls(camera, renderer.domElement);
// // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
// controls.enableDamping = true;
// 7. 挂载页面
document.body.appendChild(renderer.domElement);
// 设置时钟
const clock = new THREE.Clock();
// 鼠标的位置对象
const mouseMove = new THREE.Vector2();
// 监听鼠标移动，让几何跟随动
window.addEventListener("mousemove", (event) => {
  mouseMove.x = event.clientX / window.innerWidth - 0.5;
  mouseMove.y = event.clientY / window.innerHeight - 0.5;
});


gsap.to(cubeGroup.rotation, {
  x: "+=" + Math.PI * 2,
  y: "+=" + Math.PI * 2,
  duration: 10,
  ease: "power2.inOut",
  repeat: -1,
});
gsap.to(triangleGroup.rotation, {
  x: "-=" + Math.PI * 2,
  z: "+=" + Math.PI * 2,
  duration: 12,
  ease: "power2.inOut",
  repeat: -1,
});
gsap.to(smallBall.position, {
  x: -3,
  duration: 6,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true,
});
gsap.to(smallBall.position, {
  y: 0,
  duration: 0.5,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true,
});
// 8. 循环显示
function render() {
  let deltaTime = clock.getDelta();
  // 根据当前滚动的scrolly，去设置相机移动的位置
  camera.position.y = -(window.scrollY / window.innerHeight) * zDistance;
  // 调整摄像机x轴位置, 如果还要调整y的位置 则要给摄像机添加组 
  cameraGroup.position.x += (mouseMove.x * 10 - cameraGroup.position.x) * deltaTime * 5;
  cameraGroup.position.y += (mouseMove.y * 10 - cameraGroup.position.y) * deltaTime * 5;
  // controls.update();
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



// 创建投射光线对象
const raycaster = new THREE.Raycaster();

// 鼠标的位置对象
const mouse = new THREE.Vector2();
// 监听鼠标的位置
window.addEventListener("click", (event) => {
  // 要求得中心坐标位置 X分量与Y分量应当在-1到1之间。   所以 * 2 - 1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  raycaster.setFromCamera(mouse, camera);
  let result = raycaster.intersectObjects(cubeArr);
  result.forEach((item) => {
    item.object.material = activeMaterial;
  });
});

// 设置当前页
let currentPage = 0;
// 监听鼠标的位置
window.addEventListener("scroll", (event) => {
  const newPage = Math.round(window.scrollY / window.innerHeight);
  if (newPage != currentPage) {
    currentPage = newPage;
    gsap.to(arrGroup[currentPage].rotation, {
      z: "+=" + Math.PI * 2,
      x: "+=" + Math.PI * 2,
      duration: 1,
    });

    gsap.to(`.page${currentPage} h1`, {
      rotate: "+=360",
      duration: 1,
    });
    gsap.fromTo(
      `.page${currentPage} h3`,
      { x: -300 },
      { x: 0, rotate: "+=360", duration: 1 }
    );
  }
});



