import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification

MODEL_NAME = "kiselyovd/chest-xray-classifier"
OUTPUT_FILE = "public/models/chest_xray.onnx"

print("Downloading model...")

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)

model.eval()

print("Model loaded.")
print("Classes:", model.config.id2label)

# The model expects a 224x224 RGB image.
dummy_input = torch.randn(1, 3, 224, 224)

print("Exporting to ONNX...")

torch.onnx.export(
    model,
    (dummy_input,),
    OUTPUT_FILE,
    input_names=["pixel_values"],
    output_names=["logits"],
    dynamic_axes={
        "pixel_values": {
            0: "batch"
        },
        "logits": {
            0: "batch"
        }
    },
    opset_version=17
)

print()
print("====================================")
print("ONNX EXPORT COMPLETE")
print("====================================")
print(f"Saved to: {OUTPUT_FILE}")