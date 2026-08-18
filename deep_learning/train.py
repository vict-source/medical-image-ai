import os
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import models, transforms
from torchvision.models import ResNet18_Weights


# =========================
# CONFIGURATION
# =========================

DATA_PATH = "data/pneumoniamnist.npz"
CHECKPOINT_DIR = "checkpoints"

BATCH_SIZE = 32
EPOCHS = 5
LEARNING_RATE = 1e-4
WEIGHT_DECAY = 1e-4

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Device:", DEVICE)


# =========================
# DATASET
# =========================

class PneumoniaDataset(Dataset):

    def __init__(self, images, labels, transform=None):
        self.images = images
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.images)

    def __getitem__(self, index):

        image = self.images[index]
        label = self.labels[index]

        # Convert numpy image to PIL-compatible format
        image = image.astype(np.uint8)

        if self.transform:
            image = self.transform(image)

        label = int(np.asarray(label).reshape(-1)[0])

        return image, label


# =========================
# PREPROCESSING
# =========================

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])


# =========================
# LOAD DATA
# =========================

print("\nLoading dataset...")

data = np.load(DATA_PATH)

train_images = data["train_images"]
train_labels = data["train_labels"]

val_images = data["val_images"]
val_labels = data["val_labels"]

test_images = data["test_images"]
test_labels = data["test_labels"]

print("Training images:", len(train_images))
print("Validation images:", len(val_images))
print("Test images:", len(test_images))


# =========================
# CREATE DATASETS
# =========================

train_dataset = PneumoniaDataset(
    train_images,
    train_labels,
    transform=transform
)

val_dataset = PneumoniaDataset(
    val_images,
    val_labels,
    transform=transform
)

test_dataset = PneumoniaDataset(
    test_images,
    test_labels,
    transform=transform
)


# =========================
# DATA LOADERS
# =========================

train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=0
)

val_loader = DataLoader(
    val_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0
)

test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0
)


# =========================
# MODEL
# =========================

print("\nLoading ResNet18...")

weights = ResNet18_Weights.DEFAULT

model = models.resnet18(weights=weights)

# Replace original classifier
model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(model.fc.in_features, 2)
)

model = model.to(DEVICE)


# =========================
# LOSS + OPTIMIZER
# =========================

criterion = nn.CrossEntropyLoss()

optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=LEARNING_RATE,
    weight_decay=WEIGHT_DECAY
)


# =========================
# TRAINING
# =========================

os.makedirs(CHECKPOINT_DIR, exist_ok=True)

best_val_loss = float("inf")


for epoch in range(EPOCHS):

    print("\n" + "=" * 50)
    print(f"Epoch {epoch + 1}/{EPOCHS}")
    print("=" * 50)

    # ---------------------
    # TRAINING
    # ---------------------

    model.train()

    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in train_loader:

        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        running_loss += loss.item() * images.size(0)

        _, predicted = torch.max(outputs, 1)

        total += labels.size(0)
        correct += (predicted == labels).sum().item()

    train_loss = running_loss / total
    train_accuracy = correct / total

    print(f"Training Loss: {train_loss:.4f}")
    print(f"Training Accuracy: {train_accuracy:.4f}")


    # ---------------------
    # VALIDATION
    # ---------------------

    model.eval()

    val_running_loss = 0.0
    val_correct = 0
    val_total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            outputs = model(images)

            loss = criterion(outputs, labels)

            val_running_loss += (
                loss.item() * images.size(0)
            )

            _, predicted = torch.max(outputs, 1)

            val_total += labels.size(0)

            val_correct += (
                predicted == labels
            ).sum().item()

    val_loss = val_running_loss / val_total

    val_accuracy = val_correct / val_total

    print(f"Validation Loss: {val_loss:.4f}")
    print(f"Validation Accuracy: {val_accuracy:.4f}")


    # ---------------------
    # SAVE BEST MODEL
    # ---------------------

    if val_loss < best_val_loss:

        best_val_loss = val_loss

        checkpoint_path = os.path.join(
            CHECKPOINT_DIR,
            "best_model.pth"
        )

        torch.save(
            model.state_dict(),
            checkpoint_path
        )

        print("✓ Best model saved")


print("\n" + "=" * 50)
print("TRAINING COMPLETE")
print("=" * 50)

print(
    f"Best validation loss: {best_val_loss:.4f}"
)

print(
    f"Model saved to: {CHECKPOINT_DIR}/best_model.pth"
)