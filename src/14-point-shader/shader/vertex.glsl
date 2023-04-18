precision lowp float;

attribute float aScale;
attribute float imgIndex;
uniform float uTime;

varying vec3 vColor;
varying float vImgIndex;

void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

    // 设置顶点旋转
    // 获取顶点的角度
    float angle = atan(modelPosition.x, modelPosition.z);
    // 获取顶点到中心的距离
    float distanceToCenter = length(modelPosition.xz);
    // 设置根据顶点到中心的距离，设置不同的旋转度数
    float angleOffset = 1.0/distanceToCenter * uTime;

    // 根据旋转的偏移值，旋转当前的点
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position =  projectionMatrix * viewPosition;
    gl_PointSize = 100.0 * aScale / -viewPosition.z;

    vColor = color;
    vImgIndex = imgIndex;
}

