import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# image transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# dataset
dataset = datasets.ImageFolder(
    "dataset/video-frames",
    transform=transform
)

print(dataset.classes)

# dataloader
loader = DataLoader(
    dataset,
    batch_size=16,
    shuffle=True
)

# model
model = models.efficientnet_b0(pretrained=True)

# final layer
model.classifier[1] = nn.Linear(1280, 2)

# loss + optimizer
loss_fn = nn.CrossEntropyLoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001
)

# training loop
for epoch in range(3):

    print(f"\nEpoch {epoch+1} started")

    for i, (images, labels) in enumerate(loader):

        outputs = model(images)

        loss = loss_fn(outputs, labels)

        optimizer.zero_grad()

        loss.backward()

        optimizer.step()

        if i % 20 == 0:
            print(f"Batch {i} Loss {loss.item()}")

print("Video model training complete")

# save model
torch.save(
    model.state_dict(),
    "video_detector.pth"
)

print("Video model saved successfully")