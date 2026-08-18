import os
import torch
import torch.nn as nn
from torchvision import models


# =========================
# PATHS
# =========================

MODEL_PATH = "checkpoints/best_model.pth"

OUTPUT_DIR = r"..\public\models"
OUTPUT_PATH = os.path.join(
    OUTPUT_DIR,
    "chest_xray.onnx"
)


# =========================
# CREATE OUTPUT DIRECTORY
# =========================

os.makedirs(OUTPUT_DIR, exist_ok=True)


# =========================
# DEVICE
# =========================

device = torch.device("cpu")

print("Loading trained model...")


# =========================
# RECREATE MODEL
# =========================

model = models.resnet18(weights=None)

model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(model.fc.in_features, 2)
)


# =========================
# LOAD TRAINED WEIGHTS
# =========================

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=device
    )
)

model = model.to(device)

model.eval()

print("Trained model loaded successfully.")


# =========================
# CREATE EXAMPLE INPUT
# =========================

dummy_input = torch.randn(
    1,
    3,
    224,
    224
)


# =========================
# EXPORT TO ONNX
# =========================

print("Converting model to ONNX...")

torch.onnx.export(
    model,
    dummy_input,
    OUTPUT_PATH,
    input_names=["input"],
    output_names=["output"],
    opset_version=17,
    dynamo=False
)
print("\n========================================")
print("ONNX CONVERSION COMPLETE")
print("========================================")
print(f"Saved to: {OUTPUT_PATH}")
print("========================================")