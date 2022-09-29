<h1 align="center">yolov5.js</h1>

<p align="center"> 
    <img width="120" src="https://yolov5js-images.s3.eu-central-1.amazonaws.com/yolov5js-logo-black.png" alt="logo">
</p>

## <div align="center">Install</div>

```bash
npm install --save yolov5js
```

## <div align="center">Deploy & Predict</div>

```javascript
import {load, YOLO_V5_N_COCO_MODEL_CONFIG} from 'yolov5js'

const model = await load(YOLO_V5_N_COCO_MODEL_CONFIG)

const detections = await model.detect(image)
```
