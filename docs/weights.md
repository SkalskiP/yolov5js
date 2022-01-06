```console
git clone https://github.com/ultralytics/yolov5.git
cd yolov5
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
pip install tensorflowjs
python export.py --weights yolov5s.pt --include tfjs
```
