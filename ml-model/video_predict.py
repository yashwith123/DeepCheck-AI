import cv2
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image


# load image model
model = models.efficientnet_b0()
model.classifier[1] = nn.Linear(1280, 2)

model.load_state_dict(
    torch.load("detector.pth", map_location="cpu")
)

model.eval()

classes = ["AI", "real"]

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])


def predict_frame(frame):

    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image)
        probs = torch.softmax(output, dim=1)
        conf, pred = torch.max(probs, 1)

    return pred.item(), conf.item()


def predict_video(video_path):

    cap = cv2.VideoCapture(video_path)

    predictions = []

    frame_count = 0

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        # analyze every 30th frame
        if frame_count % 30 == 0:

            pred, conf = predict_frame(frame)

            predictions.append(pred)

        frame_count += 1

    cap.release()

    ai_count = predictions.count(0)
    real_count = predictions.count(1)

    total = len(predictions)

    if total == 0:
        return "Unable to analyze", 0

    if ai_count > real_count:
        confidence = (ai_count / total) * 100
        return "AI", confidence

    else:
        confidence = (real_count / total) * 100
        return "real", confidence
    