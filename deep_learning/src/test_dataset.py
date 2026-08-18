from pathlib import Path

from dataset import (
    PneumoniaMNISTDataset,
    get_train_transform,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]

DATASET = (
    PROJECT_ROOT
    / "data"
    / "pneumoniamnist.npz"
)


dataset = PneumoniaMNISTDataset(
    DATASET,
    split="train",
    transform=get_train_transform(),
)


image, label = dataset[0]


print()
print("=" * 50)
print("DATASET TEST")
print("=" * 50)

print("Number of images:", len(dataset))
print("Image shape:", image.shape)
print("Label:", label)
print("Class:", dataset.CLASS_NAMES[label])