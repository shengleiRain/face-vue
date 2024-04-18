<template>
  <div>
    <div>
      <p>请将摄像头对准脸部</p>
      <video id="video" style="transform: rotateY(180deg)" autoplay></video>
    </div>
    <div>
      <p>检测人脸结果</p>
      <canvas id="canvas" width="200" height="200" style="transform: rotateY(180deg)"></canvas>
    </div>
    <div>
      <button @click="openCamera">打开摄像头</button>
      <button @click="stopCamera">关闭摄像头</button>
      <button @click="authByFace">人脸登录</button>
    </div>
  </div>
</template>

<script>
import { userMedia } from '@/utils/utils.js'
import '@/assets/js/tracking-min.js'
import '@/assets/js/face-min.js'
import request from '@/utils/request.js'

export default {
  name: 'MyFace',
  //   expose: ['openCamera', 'stopCamera'],
  data() {
    return {
      videoObj: null,
      trackerTask: null,
      catchedFaceImg: null,
      lastTime: 0
    }
  },

  mounted() {
    // this.openCamera()
  },

  methods: {
    openCamera() {
      // 有可能触发一些其他的按钮会重新获取
      this.$nextTick(() => {
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        this.videoObj = document.getElementById('video')
        // eslint-disable-next-line no-undef
        const tracker = new tracking.ObjectTracker('face') // 检测人脸
        tracker.setInitialScale(4)
        tracker.setStepSize(2)
        tracker.setEdgesDensity(0.1)

        // eslint-disable-next-line no-undef
        this.trackerTask = tracking.track('#video', tracker, { camera: true })

        const constraints = {
          video: { width: 200, height: 200 },
          audio: false
        }

        userMedia(constraints, this.success, this.error)

        tracker.on('track', (event) => {
          event.data.forEach((rect) => {
            // 绘制到 canvas
            context.drawImage(this.videoObj, 0, 0, canvas.width, canvas.height)
            // context.font = '16px Helvetica'
            // context.strokeStyle = '#1890ff'
            // context.strokeRect(rect.x, rect.y, rect.width, rect.height)
          })

          if (event.data.length !== 0) {
            // 说明检测到人脸了，此时就可以截取图片传递给后端
            // canvas 调用 toDataURL
            const img = canvas.toDataURL('image/png')
            console.log('检测到了人脸～～')
            let now = Date.now()
            if (now - this.lastTime > 1000) {
              console.log('发送请求～～～')
              this.lastTime = now
              this.recognizeFace(img)
            }
          }
        })
      })
    },

    authByFace(img) {
      let imgStr = img.split(',')[1]
      request
        .post('api/face/authByFace', {
          faceImg: imgStr
        })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.error(err)
        })
    },

    recognizeFace(img) {
      let imgStr = img.split(',')[1]
      request
        .post('api/face/recognize', {
          image: imgStr
        })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.error(err)
        })
    },

    stopCamera() {
      this.handleCancel()
    },

    handleCancel() {
      this.videoObj.srcObject.getTracks()[0].stop()
      this.trackerTask.stop()
    },

    // 成功显示
    success(stream) {
      this.videoObj.srcObject = stream
      this.videoObj.play()
    },
    // 失败抛出错误，可能用户电脑没有摄像头，或者摄像头权限没有打开
    error(error) {
      // 可以在这里面提示用户
      console.log(`访问用户媒体设备失败${error.name}, ${error.message}`)
    }
  },
  beforeUnmount() {
    this.handleCancel()
  }
}
</script>

<style scoped>
button {
  border-radius: 4px;
  padding: 10px;
  margin: 10px;
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>
