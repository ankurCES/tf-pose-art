# tf-pose-art

Inspired by ["The Treachery of Sanctuary"](https://youtu.be/I5__9hq-yas)

This tries to create art based on the human pose estimation model. Used tensorflow + Coco model for human pose estimation and [Babylon.js](https://www.babylonjs.com/) to generate the art based on movement.

[Demo Video](https://youtu.be/lNv9GN---EQ)

## Requirements

- Python 3.6
- Tensorflow keras
- OpenCV
- SimpleWebSocketServer
- node + npm

Download the model from [here](https://drive.google.com/file/d/10z3ft9I8t-Uq2QtYxDpJ-reHd3kbqFFW/view?usp=sharing) and place it in `models/keras` directory


## Steps to run

Clone this repo and run the following

```
$> cd tf-pose-art
$> python pose_estimate.py
$> node sever.js
```

Navigate in your browser to [http://localhost:3000](http://localhost:3000)


## High Level Flow

![alt text](https://raw.githubusercontent.com/ankurCES/tf-pose-art/master/assets/high_level_flow.png)
