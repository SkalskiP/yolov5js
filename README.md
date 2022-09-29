![npm](https://img.shields.io/npm/dt/yolov5js)
![NPM](https://img.shields.io/npm/l/yolov5js)
![npm](https://img.shields.io/npm/v/yolov5js)

<h1 align="center">yolov5.js</h1>

<p align="center"> 
    <img width="200" src="https://yolov5js-images.s3.eu-central-1.amazonaws.com/yolov5js-logo.png" alt="Logo">
</p>

## <div align="center">Install</div>

```bash
npm install --save yolov5js
```

## <div align="center">Convert</div>

```bash
# clone YOLOv5 repository
git clone https://github.com/ultralytics/yolov5.git
cd yolov5

# create python virtual environment [recommended]
virtualenv venv
source venv/bin/activate

# install dependencies
pip install -r requirements.txt
pip install tensorflowjs

# convert model to tensorflow.js format
python export.py --weights yolov5s.pt --include tfjs
```

## <div align="center">Zoo</div>

Use and share pretrained YOLOv5 tensorflow.js models with [yolov5.js-zoo](https://github.com/SkalskiP/yolov5js-zoo).

## <div align="center">Deploy</div>

<details open>
<summary>Fetch from models zoo</summary>

```javascript
import {load, YOLO_V5_N_COCO_MODEL_CONFIG} from 'yolov5js'

const model = await load(YOLO_V5_N_COCO_MODEL_CONFIG)
```

</details>

<details open>
<summary>Fetch from custom url</summary>

```javascript
import {load, ModelConfig} from 'yolov5js'

const config = { source: 'https://raw.githubusercontent.com/SkalskiP/yolov5js-zoo/master/models/coco/yolov5n/model.json' }
const model = await load(config)
```

</details>

<details open>
<summary>Load from file</summary>

```javascript
import {load, ModelConfig} from 'yolov5js'
    
const uploadJSONInput = document.getElementById('upload-json');
const uploadWeightsInput = document.getElementById('upload-weights');
    
const config = { source: [uploadJSONInput.files[0], uploadWeightsInput.files[0]] }
const model = await load(config)
```

</details>

## <div align="center">Kudos</div>

Kudos to [ultralytics](https://ultralytics.com/) team as well as all other open-source contributors for building [YOLOv5](https://github.com/ultralytics/yolov5) project, and making it all possible.


## <div align="center">License</div>

Project is freely distributable under the terms of the [MIT license](LICENSE).
