from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

from dataset import (
    PneumoniaMNISTDataset,
    get_train_transform,
    get_eval_transform,
)

from model import PneumoniaClassifier


# ============================================================
# CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

DATASET_PATH = (
    PROJECT_ROOT
    / "data"
    / "pneumoniamnist.npz"
)

CHECKPOINT_DIR = PROJECT_ROOT / "checkpoints"
RESULTS_DIR = PROJECT_ROOT / "results"

CHECKPOINT_DIR.mkdir(exist_ok=True)
RESULTS_DIR.mkdir(exist_ok=True)


BATCH_SIZE = 32
EPOCHS = 5
LEARNING_RATE = 1e-4

NUM_CLASSES = 2


# ============================================================
# DEVICE
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("=" * 60)
print("PNEUMONIA CLASSIFICATION TRAINING")
print("=" * 60)

print(f"Device: {device}")

if device.type == "cuda":
    print(f"GPU: {torch.cuda.get_device_name(0)}")
else:
    print("GPU not detected. Training on CPU.")

print()


# ============================================================
# DATASETS
# ============================================================

print("Loading datasets...")

train_dataset = PneumoniaMNISTDataset(
    DATASET_PATH,
    split="train",
    transform=get_train_transform(),
)

val_dataset = PneumoniaMNISTDataset(
    DATASET_PATH,
    split="val",
    transform=get_eval_transform(),
)

test_dataset = PneumoniaMNISTDataset(
    DATASET_PATH,
    split="test",
    transform=get_eval_transform(),
)


# ============================================================
# DATALOADERS
# ============================================================

train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=0,
)

val_loader = DataLoader(
    val_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0,
)

test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0,
)


print()
print("Dataset sizes:")
print(f"Training:   {len(train_dataset)}")
print(f"Validation: {len(val_dataset)}")
print(f"Testing:    {len(test_dataset)}")
print()


# ============================================================
# MODEL
# ============================================================

model = PneumoniaClassifier(
    num_classes=NUM_CLASSES
)

model = model.to(device)


# ============================================================
# LOSS AND OPTIMIZER
# ============================================================

criterion = nn.CrossEntropyLoss()

optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=LEARNING_RATE,
    weight_decay=1e-4,
)


# ============================================================
# TRAINING FUNCTION
# ============================================================

def train_one_epoch(model, loader):

    model.train()

    running_loss = 0.0

    predictions = []
    targets = []

    for images, labels in loader:

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(
            outputs,
            labels
        )

        loss.backward()

        optimizer.step()

        running_loss += (
            loss.item()
            * images.size(0)
        )

        predicted = torch.argmax(
            outputs,
            dim=1
        )

        predictions.extend(
            predicted.detach()
            .cpu()
            .numpy()
        )

        targets.extend(
            labels.detach()
            .cpu()
            .numpy()
        )

    epoch_loss = (
        running_loss
        / len(loader.dataset)
    )

    accuracy = accuracy_score(
        targets,
        predictions
    )

    return epoch_loss, accuracy


# ============================================================
# VALIDATION FUNCTION
# ============================================================

def evaluate(model, loader):

    model.eval()

    running_loss = 0.0

    predictions = []
    targets = []

    with torch.no_grad():

        for images, labels in loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            loss = criterion(
                outputs,
                labels
            )

            running_loss += (
                loss.item()
                * images.size(0)
            )

            predicted = torch.argmax(
                outputs,
                dim=1
            )

            predictions.extend(
                predicted.cpu().numpy()
            )

            targets.extend(
                labels.cpu().numpy()
            )

    loss = (
        running_loss
        / len(loader.dataset)
    )

    accuracy = accuracy_score(
        targets,
        predictions
    )

    return loss, accuracy


# ============================================================
# TRAINING LOOP
# ============================================================

best_val_accuracy = 0.0

print("=" * 60)
print("STARTING TRAINING")
print("=" * 60)
print()


for epoch in range(EPOCHS):

    train_loss, train_accuracy = train_one_epoch(
        model,
        train_loader
    )

    val_loss, val_accuracy = evaluate(
        model,
        val_loader
    )

    print(
        f"Epoch [{epoch + 1}/{EPOCHS}]"
    )

    print(
        f"Train Loss: {train_loss:.4f}"
    )

    print(
        f"Train Accuracy: "
        f"{train_accuracy * 100:.2f}%"
    )

    print(
        f"Validation Loss: "
        f"{val_loss:.4f}"
    )

    print(
        f"Validation Accuracy: "
        f"{val_accuracy * 100:.2f}%"
    )

    print("-" * 60)

    # Save best model
    if val_accuracy > best_val_accuracy:

        best_val_accuracy = val_accuracy

        checkpoint_path = (
            CHECKPOINT_DIR
            / "best_model.pth"
        )

        torch.save(
            {
                "model_state_dict":
                    model.state_dict(),

                "optimizer_state_dict":
                    optimizer.state_dict(),

                "epoch":
                    epoch + 1,

                "val_accuracy":
                    val_accuracy,
            },
            checkpoint_path
        )

        print(
            f"Best model saved → "
            f"{checkpoint_path}"
        )

        print()


# ============================================================
# LOAD BEST MODEL
# ============================================================

checkpoint_path = (
    CHECKPOINT_DIR
    / "best_model.pth"
)

checkpoint = torch.load(
    checkpoint_path,
    map_location=device
)

model.load_state_dict(
    checkpoint["model_state_dict"]
)


# ============================================================
# FINAL TEST EVALUATION
# ============================================================

print()
print("=" * 60)
print("FINAL TEST EVALUATION")
print("=" * 60)


model.eval()

predictions = []
targets = []

with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(device)

        outputs = model(images)

        predicted = torch.argmax(
            outputs,
            dim=1
        )

        predictions.extend(
            predicted.cpu().numpy()
        )

        targets.extend(
            labels.numpy()
        )


accuracy = accuracy_score(
    targets,
    predictions
)

precision = precision_score(
    targets,
    predictions,
    zero_division=0
)

recall = recall_score(
    targets,
    predictions,
    zero_division=0
)

f1 = f1_score(
    targets,
    predictions,
    zero_division=0
)


print(
    f"Test Accuracy:  "
    f"{accuracy * 100:.2f}%"
)

print(
    f"Test Precision: "
    f"{precision * 100:.2f}%"
)

print(
    f"Test Recall:    "
    f"{recall * 100:.2f}%"
)

print(
    f"Test F1 Score:  "
    f"{f1 * 100:.2f}%"
)

print()
print("Training complete.")
print(
    f"Best validation accuracy: "
    f"{best_val_accuracy * 100:.2f}%"
)