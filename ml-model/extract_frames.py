import cv2
import os

# FAKE VIDEO DATASET
video_folder = "dataset/Real-Video/video"

# SAVE FRAMES HERE
output_folder = "dataset/video-frames/real"

os.makedirs(output_folder, exist_ok=True)

count = 0

for video_name in os.listdir(video_folder):

    video_path = os.path.join(video_folder, video_name)

    cap = cv2.VideoCapture(video_path)

    frame_num = 0

    while True:

        success, frame = cap.read()

        if not success:
            break

        if frame_num % 30 == 0:

            frame_path = os.path.join(
                output_folder,
                f"{count}.jpg"
            )

            cv2.imwrite(frame_path, frame)

            count += 1

        frame_num += 1

    cap.release()

print("Fake frames extracted successfully")