const COCO_YOLOV5S_URL = ""

export interface Detection {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    categoryId: number;
    categoryName: string | null;
}

export class YOLOv5 {
    async detect(): Promise<Detection[]> {
        return new Promise((resolve, _) => {
            resolve([])
        })
    }
}

export async function load(): Promise<YOLOv5> {
    return new YOLOv5();
}
