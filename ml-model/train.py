import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# DEVICE
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using device:", device)

# TRANSFORMS
transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(
        brightness=0.2,
        contrast=0.2,
        saturation=0.2
    ),
    transforms.ToTensor()
])

# DATASET
dataset = datasets.ImageFolder(
    root="dataset/Final Dataset",
    transform=transform
)

print("Classes:", dataset.classes)

# DATALOADER
loader = DataLoader(
    dataset,
    batch_size=16,
    shuffle=True
)

# MODEL
model = models.efficientnet_b0(pretrained=True)

model.classifier[1] = nn.Linear(
    1280,
    2
)

model = model.to(device)

# LOSS + OPTIMIZER
loss_fn = nn.CrossEntropyLoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.0005
)

# TRAINING
epochs = 10

for epoch in range(epochs):

    print(f"\nEpoch {epoch+1}/{epochs} started")

    running_loss = 0.0

    for i, (images, labels) in enumerate(loader):

        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)

        loss = loss_fn(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        running_loss += loss.item()

        if i % 20 == 0:
            print(f"Batch {i} Loss: {loss.item():.4f}")

    avg_loss = running_loss / len(loader)

    print(f"Epoch {epoch+1} Average Loss: {avg_loss:.4f}")

# SAVE MODEL
torch.save(
    model.state_dict(),
    "detector.pth"
)

print("\nModel saved successfully")