from PIL import Image
import os

_model = None
_device = None
_transform = None
_classes = ["fake", "real"]


def _load_model():
    global _model, _device, _transform
    if _model is not None:
        return

    try:
        import torch
        import torch.nn as nn
        from torchvision import models, transforms
    except Exception as e:
        raise RuntimeError(f"Failed to import torch/torchvision: {e}")

    _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    try:
        model = models.efficientnet_b0(pretrained=False)
        model.classifier[1] = nn.Linear(1280, 2)
        model_path = os.path.join(os.path.dirname(__file__), "detector.pth")
        model.load_state_dict(torch.load(model_path, map_location=_device))
        model = model.to(_device)
        model.eval()
    except Exception as e:
        raise RuntimeError(f"Failed to load model or weights: {e}")

    _transform = transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ToTensor()
    ])

    _model = model


def predict_image(path):
    try:
        _load_model()
    except Exception as e:
        raise

    import torch

    img = Image.open(path).convert("RGB")
    img = _transform(img).unsqueeze(0).to(_device)

    with torch.no_grad():
        output = _model(img)
        probabilities = torch.softmax(output, dim=1)
        prediction = torch.argmax(probabilities, dim=1).item()
        confidence = probabilities[0][prediction].item() * 100

    confidence = round(confidence, 2)
    label = _classes[prediction]
    return label, confidence


if __name__ == "__main__":
    test_path = os.path.join(os.path.dirname(__file__), "ai3.jpg")
    if os.path.exists(test_path):
        try:
            label, conf = predict_image(test_path)
            print(f"Prediction: {label} ({conf:.2f}%)")
        except Exception as e:
            print("Error:", e)
    else:
        print("No test image found")