import numpy as np
import torch
import torch.nn as nn

from torch.utils.data import Dataset, DataLoader
from torchvision import models, transforms


# =========================
# CONFIGURATION
# =========================

DATA_PATH = "data/pneumoniamnist.npz"
MODEL_PATH = "checkpoints/best_model.pth"

BATCH_SIZE = 32

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

        image = image.astype(np.uint8)

        if self.transform:
            image = self.transform(image)

        label = int(
            np.asarray(label).reshape(-1)[0]
        )

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
# LOAD TEST DATA
# =========================

print("\nLoading test dataset...")

data = np.load(DATA_PATH)

test_images = data["test_images"]
test_labels = data["test_labels"]

print("Test images:", len(test_images))


test_dataset = PneumoniaDataset(
    test_images,
    test_labels,
    transform=transform
)

test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0
)


# =========================
# LOAD MODEL
# =========================

print("\nLoading trained model...")

model = models.resnet18(weights=None)

model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(model.fc.in_features, 2)
)

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=DEVICE
    )
)

model = model.to(DEVICE)
model.eval()

print("Model loaded successfully.")


# =========================
# EVALUATION
# =========================

correct = 0
total = 0

class_correct = [0, 0]
class_total = [0, 0]

with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        outputs = model(images)

        predictions = torch.argmax(
            outputs,
            dim=1
        )

        total += labels.size(0)

        correct += (
            predictions == labels
        ).sum().item()

        for label, prediction in zip(
            labels,
            predictions
        ):

            label = label.item()
            prediction = prediction.item()

            class_total[label] += 1

            if label == prediction:
                class_correct[label] += 1


# =========================
# RESULTS
# =========================

accuracy = correct / total

print("\n" + "=" * 50)
print("MODEL EVALUATION")
print("=" * 50)

print(
    f"Test Accuracy: {accuracy * 100:.2f}%"
)

print("\nClass Performance:")

print(
    f"Class 0 Accuracy: "
    f"{class_correct[0] / class_total[0] * 100:.2f}%"
)

print(
    f"Class 1 Accuracy: "
    f"{class_correct[1] / class_total[1] * 100:.2f}%"
)

print("\nEvaluation complete.")