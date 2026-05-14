import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import cv2
import os

# load model
model = models.efficientnet_b0()
model.classifier[1] = nn.Linear(1280, 2)

video_model_path = os.path.join(os.path.dirname(__file__), "video_detector.pth")
model.load_state_dict(
    torch.load(video_model_path, map_location="cpu")
)

model.eval()

classes = ["fake", "real"]

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def predict_video(video_path):

    cap = cv2.VideoCapture(video_path)

    fake_count = 0
    real_count = 0

    frame_num = 0

    while True:

        success, frame = cap.read()

        if not success:
            break

        # analyze every 30th frame
        if frame_num % 30 == 0:

            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            img = Image.fromarray(frame)

            img = transform(img).unsqueeze(0)

            with torch.no_grad():

                out = model(img)

                probs = torch.softmax(out, dim=1)

                conf, pred = torch.max(probs, 1)

                label = classes[pred.item()]

                if label == "fake":
                    fake_count += 1
                else:
                    real_count += 1

        frame_num += 1

    cap.release()

    # final decision
    if fake_count > real_count:
        final_label = "FAKE VIDEO"
    else:
        final_label = "REAL VIDEO"

    total = fake_count + real_count

    confidence = (
        max(fake_count, real_count) / total
    ) * 100

    return final_label, confidence


# test
if __name__ == "__main__":
    test_path = os.path.join(os.path.dirname(__file__), "test.mp4")
    if os.path.exists(test_path):
        label, confidence = predict_video(test_path)
        print(f"Prediction: {label}")
        print(f"Confidence: {confidence:.2f}%")
    else:
        print("No test video found")