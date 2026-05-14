import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# -------------------------------
# 1. Device (CPU / GPU)
# -------------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# -------------------------------
# 2. Transforms (Improved)
# -------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor()
])

# -------------------------------
# 3. Dataset
# -------------------------------
dataset = datasets.ImageFolder(
    "dataset/AI-face-detection-Dataset",
    transform=transform
)

print("Classes:", dataset.classes)

loader = DataLoader(
    dataset,
    batch_size=16,
    shuffle=True
)

# -------------------------------
# 4. Model (EfficientNet)
# -------------------------------
model = models.efficientnet_b0(weights="DEFAULT")

# Freeze all layers (FAST training)
for param in model.parameters():
    param.requires_grad = False

# Replace classifier
model.classifier[1] = nn.Linear(1280, 2)

# Train only classifier
for param in model.classifier.parameters():
    param.requires_grad = True

model = model.to(device)

# -------------------------------
# 5. Loss + Optimizer
# -------------------------------
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.classifier.parameters(), lr=0.001)

# -------------------------------
# 6. Training Loop
# -------------------------------
epochs = 2   # ⚡ reduced for speed

for epoch in range(epochs):
    print(f"\nEpoch {epoch+1}/{epochs}")

    total_loss = 0

    for i, (images, labels) in enumerate(loader):
        images, labels = images.to(device), labels.to(device)

        outputs = model(images)
        loss = loss_fn(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

        if i % 20 == 0:
            print(f"Batch {i}, Loss: {loss.item():.4f}")

    print(f"Epoch {epoch+1} Loss: {total_loss:.4f}")

# -------------------------------
# 7. Save Model
# -------------------------------
torch.save(model.state_dict(), "detector.pth")

print("✅ Model saved successfully!")