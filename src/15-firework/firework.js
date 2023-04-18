import * as THREE from "three";
import startPointFragment from "./shaders/startPoint/fragment.glsl";
import startPointVertex from "./shaders/startPoint/vertex.glsl";
import fireworksFragment from "./shaders/fireworks/fragment.glsl";
import fireworksVertex from "./shaders/fireworks/vertex.glsl";

export default class Fireworks {
  constructor(color, to, from = { x: 0, y: 3, z: 0 }) {

    // 开始计时
    this.clock = new THREE.Clock();
    // 创建烟花
    this.color = new THREE.Color(color);

    this.createStartPoint(to, from);
    this.createExplosionPoint(to);
    this.initAudio();


  }

  createStartPoint(to, from) {
    // 创建烟花发射的球点
    this.startGeometry = new THREE.BufferGeometry();
    const startPositionArray = new Float32Array(3);
    startPositionArray[0] = from.x;
    startPositionArray[1] = from.y;
    startPositionArray[2] = from.z;
    this.startGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(startPositionArray, 3)
    );

    const astepArray = new Float32Array(3);
    astepArray[0] = to.x - from.x;
    astepArray[1] = to.y - from.y;
    astepArray[2] = to.z - from.x;
    this.startGeometry.setAttribute(
      "aStep",
      new THREE.BufferAttribute(astepArray, 3)
    );

    // 设置着色器材质
    this.startMaterial = new THREE.ShaderMaterial({
      vertexShader: startPointVertex,
      fragmentShader: startPointFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 10,
        },
        uColor: { value: this.color },
      },
    });

    this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial);
  }

  createExplosionPoint(to) {
    // 创建爆炸的烟花
    this.fireworkGeometry = new THREE.BufferGeometry();
    this.FireworksCount = 180 + Math.floor(Math.random() * 180);
    const positionFireworksArray = new Float32Array(this.FireworksCount * 3);
    const scaleFireArray = new Float32Array(this.FireworksCount);
    const directionArray = new Float32Array(this.FireworksCount * 3);
    for (let i = 0; i < this.FireworksCount; i++) {
      // 一开始烟花位置
      positionFireworksArray[i * 3 + 0] = to.x;
      positionFireworksArray[i * 3 + 1] = to.y;
      positionFireworksArray[i * 3 + 2] = to.z;
      //   设置烟花所有粒子初始化大小
      scaleFireArray[i] = Math.random();
      //   设置四周发射的角度

      let theta = Math.random() * 2 * Math.PI;
      let beta = Math.random() * 2 * Math.PI;
      let r = Math.random();

      directionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
      directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
      directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);

    }
    this.fireworkGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionFireworksArray, 3)
    );
    this.fireworkGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleFireArray, 1)
    );
    this.fireworkGeometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(directionArray, 3)
    );

    this.fireworksMaterial = new THREE.ShaderMaterial({
      vertexShader: fireworksVertex,
      fragmentShader: fireworksFragment,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 0,
        },
        uColor: { value: this.color },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.fireworks = new THREE.Points(
      this.fireworkGeometry,
      this.fireworksMaterial
    );
  }

  initAudio() {
    // 创建音频
    this.linstener = new THREE.AudioListener();
    this.linstener1 = new THREE.AudioListener();
    this.sound = new THREE.Audio(this.linstener);
    this.sendSound = new THREE.Audio(this.linstener1);

    // 创建音频加载器
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      `./assets/audio/pow${Math.floor(Math.random() * 4) + 1}.ogg`,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(1);
      }
    );

    audioLoader.load(`./assets/audio/send.mp3`, (buffer) => {
      this.sendSound.setBuffer(buffer);
      this.sendSound.setLoop(false);
      this.sendSound.setVolume(0.1);
    });
  }

  //   添加到场景
  addScene(scene) {
    scene.add(this.startPoint);
    scene.add(this.fireworks);
    this.scene = scene;
  }
  //   update变量
  update() {
    const elapsedTime = this.clock.getElapsedTime();
    const shootTime = 1;
    if (elapsedTime <= shootTime) {
      this.startMaterial.uniforms.uTime.value = elapsedTime;
      this.startMaterial.uniforms.uSize.value = 20;
      // 声音比光速慢
      if (elapsedTime > 0.1 && !this.sendSound.isPlaying && !this.sendSoundplay) {
        this.sendSound.play();
        this.sendSoundplay = true;
      }

    } else {
      //  让发射点元素消失
      this.clearStartPoint();

      // 设置烟花爆炸效果
      this.fireworksMaterial.uniforms.uSize.value = 20;
      this.fireworksMaterial.uniforms.uTime.value = elapsedTime - shootTime;

      if (!this.sound.isPlaying && !this.play) {
        this.sound.play();
        this.play = true;
      }

      if (elapsedTime > 4) {
        this.clearFirework();
        return "remove";
      }
    }

  }

  clearStartPoint() {
    this.startMaterial.uniforms.uSize.value = 0;
    this.startPoint.clear();
    this.startGeometry.dispose();
    this.startMaterial.dispose();
  }

  clearFirework() {
    this.fireworksMaterial.uniforms.uSize.value = 0;
    this.fireworks.clear();
    this.fireworkGeometry.dispose();
    this.fireworksMaterial.dispose();
    this.scene.remove(this.fireworks);
    this.scene.remove(this.startPoint);
  }
}

