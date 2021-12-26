import {GraphModel} from '@tensorflow/tfjs-converter/dist/executor/graph_model';

import * as tf from '@tensorflow/tfjs'

const COCO_NAMES = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
    'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
    'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
    'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
    'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
    'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
    'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
    'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
    'hair drier', 'toothbrush']

const INPUT_RESOLUTION: [number, number] = [640, 640]

export declare type ObjectDetectionBaseModel = 'yolov5n' | 'yolov5s' | 'yolov5m';

export interface ModelConfig {
    base: ObjectDetectionBaseModel;
    modelUrl: string;
    classNames: string[];
}

export const YOLO_V5_N_COCO_MODEL_CONFIG: ModelConfig = {
    base: 'yolov5n',
    modelUrl: 'https://raw.githubusercontent.com/SkalskiP/ILearnMachineLearning.js/master/models/yolov5n/model.json',
    classNames: COCO_NAMES
}

export const YOLO_V5_S_COCO_MODEL_CONFIG: ModelConfig = {
    base: 'yolov5s',
    modelUrl: 'https://raw.githubusercontent.com/SkalskiP/ILearnMachineLearning.js/master/models/yolov5s/model.json',
    classNames: COCO_NAMES
}

export const YOLO_V5_M_COCO_MODEL_CONFIG: ModelConfig = {
    base: 'yolov5m',
    modelUrl: 'https://raw.githubusercontent.com/SkalskiP/ILearnMachineLearning.js/master/models/yolov5m/model.json',
    classNames: COCO_NAMES
}

export interface DetectedObject {
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
    class: string;
}

export class YOLOv5 {
    public model: GraphModel
    public inputResolution: [number, number]
    public classNames: string[]

    constructor(model: GraphModel, inputResolution: [number, number], classNames: string[]) {
        this.model = model
        this.inputResolution = inputResolution
        this.classNames = classNames
    }

    // public static image2tensor

    // @ts-ignore
    public async detect(image: HTMLImageElement, minScore?: number): Promise<DetectedObject[]> {
        const input = tf.tidy(() => {
            const imageTensor = tf.browser.fromPixels(image);
            return  tf.image
                .resizeBilinear(imageTensor, this.inputResolution)
                .div(255.0)
                .expandDims(0);
        });
        const result = await this.model.executeAsync(input) as tf.Tensor[];
        const boxes = result[0].dataSync() as Float32Array;
        const scores = result[1].dataSync() as Float32Array;
        const classes = result[2].dataSync() as Float32Array;

        input.dispose();
        tf.dispose(result);

        const detections: DetectedObject[] = [];

        console.log(boxes)
        console.log(scores)
        console.log(classes)

        return detections
    }
}

export async function load(config: ModelConfig, inputResolution: [number, number] = INPUT_RESOLUTION): Promise<YOLOv5> {
    return tf.loadGraphModel(config.modelUrl).then((model: GraphModel) => {
        return new YOLOv5(model, inputResolution, config.classNames)
    });
}
