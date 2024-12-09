from transformers import pipeline
from PIL import Image
import numpy as np
import os


labels = ["Hat", "Upper-clothes", "Skirt", "Pants",
          "Dress", "Belt", "Left-shoe", "Right-shoe", "Scarf"]

# Initialize segmentation pipeline
segmenter = pipeline(model="mattmdjaga/segformer_b2_clothes")


def segment_clothing(img, clothes=None):

    if clothes == None:
        clothes = labels
    # Segment image
    segments = segmenter(img)

    # Create list of masks
    clothing = {}
    mask_list = []

    main = img.copy()

    enter = 0

    final_mask = np.zeros(img.size+(3,), dtype=np.uint8)
    for s in segments:
        if (s['label'] in clothes):
            mask_list.append(s['mask'])
            enter |= 1

            cpy = img.copy()

            # Paste all masks on top of eachother
            final_mask = np.array(s['mask'])

            # Convert final mask from np array to PIL image
            final_mask = Image.fromarray(final_mask)

            # Apply mask to original image
            cpy.putalpha(final_mask)
            # mask_list.append(s['mask'])
            clothing[s['label']] = cpy.copy()

    final_mask = np.array(mask_list[0])
    for mask in mask_list:
        current_mask = np.array(mask)
        final_mask = final_mask + current_mask

    final_mask = Image.fromarray(final_mask)

    main.putalpha(final_mask)

    clothing["Composite"] = main
    if not enter:
        return {"Background": Image.fromarray(final_mask)}
    return clothing


def batch_segment_clothing(img_dir, out_dir, clothes=None):

    if clothes == None:
        clothes = labels

    # Create output directory if it doesn't exist
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    # Iterate through each file in the input directory
    for filename in os.listdir(img_dir):
        if filename.endswith(".jpg") or filename.endswith(".JPG") or filename.endswith(".png") or filename.endswith(".PNG"):
            try:
                # Load image
                img_path = os.path.join(img_dir, filename)
                img = Image.open(img_path).convert("RGBA")

                # Segment clothing
                segmented_img = segment_clothing(img, clothes)

                # Save segmented image to output directory as PNG
                out_path = os.path.join(
                    out_dir, filename.split('.')[0] + ".png")
                segmented_img.save(out_path)

                print(f"Segmented {filename} successfully.")

            except Exception as e:
                print(f"Error processing {filename}: {e}")

        else:
            print(f"Skipping {filename} as it is not a supported image file.")
