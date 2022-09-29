import * as tf from '@tensorflow/tfjs'
import {GraphModel} from "@tensorflow/tfjs-converter/dist/executor/graph_model";

const COCO_NAMES = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
    'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
    'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
    'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
    'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
    'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
    'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
    'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
    'hair drier', 'toothbrush'];

const INFERENCE_RESOLUTION: [number, number] = [640, 640];

export interface ModelConfig {
    source: string | File[];
    classNames?: string[];
}

export const YOLO_V5_N_COCO_MODEL_CONFIG: ModelConfig = {
    source: 'https://raw.githubusercontent.com/SkalskiP/yolov5js-zoo/master/models/coco/yolov5n/model.json',
    classNames: COCO_NAMES
}

export const YOLO_V5_S_COCO_MODEL_CONFIG: ModelConfig = {
    source: 'https://raw.githubusercontent.com/SkalskiP/yolov5js-zoo/master/models/coco/yolov5s/model.json',
    classNames: COCO_NAMES
}

export const YOLO_V5_M_COCO_MODEL_CONFIG: ModelConfig = {
    source: 'https://raw.githubusercontent.com/SkalskiP/yolov5js-zoo/master/models/coco/yolov5m/model.json',
    classNames: COCO_NAMES
}

export interface DetectedObject {
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
    classId: number;
    class?: string;
}

export class YOLOv5 {
    public model: GraphModel;
    public inferenceResolution: [number, number];
    public classNames?: string[];

    constructor(model: GraphModel, inferenceResolution: [number, number], classNames?: string[]) {
        this.model = model;
        this.inferenceResolution = inferenceResolution;
        this.classNames = classNames;
    }

    public static preprocessImage(
        image: HTMLImageElement | HTMLCanvasElement,
        inferenceResolution: [number, number]
    ): [tf.Tensor4D, [number, number]] {
        const inputTensor = tf.browser.fromPixels(image);
        const inputResolution: [number, number] = [image.height, image.width];
        const preprocessedTensor: tf.Tensor4D = tf.image
            .resizeBilinear(inputTensor, inferenceResolution)
            .div(255.0)
            .expandDims(0);
        return [preprocessedTensor, inputResolution];
    }

    public static postprocessResults(
        boxes: Float32Array,
        scores: Float32Array,
        classes: Float32Array,
        inputResolution: [number, number],
        classNames?: string[],
        minScore?: number
    ): DetectedObject[] {
        const scoreThreshold: number = minScore !== undefined ? minScore : 0;
        const [inputHeight, inputWidth] = inputResolution;
        const detections: DetectedObject[] = [];
        for (let i = 0; i < scores.length; i++) {
            const score = scores[i];
            if (score < scoreThreshold) {
                continue;
            }
            const bbox = [];
            for (let j = 0; j < 4; j++) {
                bbox[j] = boxes[i * 4 + j];
            }
            const minX = bbox[0] * inputWidth;
            const minY = bbox[1] * inputHeight;
            const maxX = bbox[2] * inputWidth;
            const maxY = bbox[3] * inputHeight;
            const width = maxX - minX;
            const height = maxY - minY;
            const classId = classes[i];
            const className = classNames !== undefined ? classNames[classes[i]] : undefined;
            detections.push({
                x: minX,
                y: minY,
                width: width,
                height: height,
                score: score,
                classId: classId,
                class: className,
            });
        }
        return detections;
    }

    public async detect(image: HTMLImageElement | HTMLCanvasElement, minScore?: number): Promise<DetectedObject[]> {
        const [preprocessedTensor, inputResolution] = tf.tidy(() => {
            return YOLOv5.preprocessImage(image, this.inferenceResolution);
        });
        const result = await this.model.executeAsync(preprocessedTensor) as tf.Tensor[];
        const boxes = result[0].dataSync() as Float32Array;
        const scores = result[1].dataSync() as Float32Array;
        const classes = result[2].dataSync() as Float32Array;

        preprocessedTensor.dispose();
        tf.dispose(result);

        return YOLOv5.postprocessResults(boxes, scores, classes, inputResolution, this.classNames, minScore);
    }
}

export async function load(config: ModelConfig, inputResolution: [number, number] = INFERENCE_RESOLUTION): Promise<YOLOv5> {
    if (typeof config.source === 'string') {
        return tf.loadGraphModel(config.source).then((model: GraphModel) => {
            return new YOLOv5(model, inputResolution, config.classNames);
        });
    } else {
        return tf.loadGraphModel(tf.io.browserFiles(config.source)).then((model: GraphModel) => {
            return new YOLOv5(model, inputResolution, config.classNames);
        });
    }
}
