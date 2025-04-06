# -*- coding: utf-8 -*-
"""NextMed(VGG16).ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/17yfd26TQTe9c3JhKwDaa_QkIRNPvY3IL
"""

from google.colab import files
import matplotlib.pyplot as plt
uploaded = files.upload()

for fn in uploaded.keys():
  print('User uploaded file "{name}" with length {length} bytes'.format(
      name=fn, length=len(uploaded[fn])))

# Then move kaggle.json into the folder where the API expects to find it.
!mkdir -p ~/.kaggle/ && mv kaggle.json ~/.kaggle/ && chmod 600 ~/.kaggle/kaggle.json

import kagglehub

# Download latest version
path = kagglehub.dataset_download("pacificrm/skindiseasedataset")

print("Path to dataset files:", path)

!kaggle datasets download - kagglehub.dataset_download("pacificrm/skindiseasedataset")

import tensorflow as tf
from zipfile import ZipFile
import os,glob
import cv2
from tqdm._tqdm_notebook import tqdm_notebook as tqdm
import numpy as np
from tqdm._tqdm_notebook import tqdm_notebook as tqdm
import numpy as np
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import Convolution2D, Dropout, Dense,MaxPooling2D
from keras.layers import BatchNormalization
from keras.layers import MaxPooling2D
from keras.layers import Flatten

from zipfile import ZipFile
file_name = "/content/drive/MyDrive/Classroom/SkinDisease.zip"
with ZipFile(file_name,'r') as zip:
  zip.extractall()
  print('Done')

os.chdir('/content/SkinDisease/SkinDisease/test/Acne')
X = []
y = []
for i in tqdm(os.listdir()):
    # Check if it's a file and an image before processing
    if os.path.isfile(i) and i.lower().endswith(('.png', '.jpg', '.jpeg')):  # Add more extensions if needed
        img = cv2.imread(i)
        if img is not None:  # Make sure the image was loaded
            img = cv2.resize(img, (224, 224))
            X.append(img)
            y.append((i[0:1]))  # Assuming the first character of the filename represents the label
        else:
            print(f"Could not load image: {i}")  # Print a warning for debugging
    else:
        print(f"Skipping: {i}")  # Indicate that a directory or non-image file was skipped

os.chdir('/content/SkinDisease/SkinDisease/train/Acne')
for i in tqdm(os.listdir()):
    # Check if it's a file and an image before processing
    if os.path.isfile(i) and i.lower().endswith(('.png', '.jpg', '.jpeg')):  # Add more extensions if needed
        img = cv2.imread(i)
        if img is not None:  # Make sure the image was loaded
            img = cv2.resize(img, (224, 224))
            X.append(img)
            # Assuming your labels are binary, change 'N' to either '0' or '1'
            y.append('0')  # or y.append('1'), depending on your labeling scheme
        else:
            print(f"Could not load image: {i}")  # Print a warning for debugging
    else:
        print(f"Skipping: {i}")  # Indicate that a directory or non-image file was skipped

# Commented out IPython magic to ensure Python compatibility.
# %matplotlib inline
import matplotlib.pyplot as plt
plt.figure(figsize=(10, 10))
for i in range(6):
    plt.subplot(1, 6, i+1)
    plt.imshow(X[i], cmap="gray")
    plt.axis('off')
plt.show()

print(len(X), len(y))  # These should be equal

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Shape of an image in X_train: ", X_train[0].shape)
print("Shape of an image in X_test: ", X_test[0].shape)

le = preprocessing.LabelEncoder()
y_train = le.fit_transform(y_train)
y_test = le.fit_transform(y_test)
num_classes = len(np.unique(np.concatenate([y_train, y_test])))
y_train = tf.keras.utils.to_categorical(y_train, num_classes=num_classes)
y_test = tf.keras.utils.to_categorical(y_test, num_classes=num_classes)

y_train = np.array(y_train)
X_train = np.array(X_train)
y_test = np.array(y_test)
X_test = np.array(X_test)

print("X_train Shape: ", X_train.shape)
print("X_test Shape: ", X_test.shape)
print("y_train Shape: ", y_train.shape)
print("y_test Shape: ", y_test.shape)

from keras.applications import vgg16


img_rows, img_cols = 224, 224


vgg = vgg16.VGG16(weights = 'imagenet',
                 include_top = False,
                 input_shape = (img_rows, img_cols, 3))
# Here we freeze the last 4 layers
# Layers are set to trainable as True by default
for layer in vgg.layers:
    layer.trainable = False

# Let's print our layers
for (i,layer) in enumerate(vgg.layers):
    print(str(i) + " "+ layer.__class__.__name__, layer.trainable)

def lw(bottom_model, num_classes):
    """creates the top or head of the model that will be
    placed ontop of the bottom layers"""

    top_model = bottom_model.output
    top_model = GlobalAveragePooling2D()(top_model)
    top_model = Dense(1024,activation='relu')(top_model)
    top_model = Dense(1024,activation='relu')(top_model)
    top_model = Dense(512,activation='relu')(top_model)
    top_model = Dense(num_classes, activation='softmax')(top_model)
    model.add(Dense(10, activation='softmax'))  # 10-class classification
    return top_model

from keras.models import Model

def lw(base_model, num_classes):
    x = base_model.output  # Get the last layer output of VGG16
    x = Flatten()(x)  # Flatten the features
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(num_classes, activation='softmax')(x)  # Final output layer
    return x  # This ensures x is a KerasTensor, not a Sequential model

num_classes = 2

# Assuming `vgg` is already defined as a pretrained VGG16 model
FC_Head = lw(vgg, num_classes)

# Now it correctly creates a functional model
model = Model(inputs=vgg.input, outputs=FC_Head)

print(model.summary())

import numpy as np

print(f"Unique labels in y_train: {np.unique(y_train)}")
print(f"Number of classes in y_train: {len(np.unique(y_train))}")

import tensorflow as tf
tf.keras.backend.clear_session()

from keras.utils import to_categorical
import numpy as np  # Ensure numpy is also imported
from keras.utils import to_categorical
import numpy as np  # Ensure numpy is imported

# Ensure y_train and y_test are defined before using them
num_classes = len(np.unique(y_train))  # Get the correct number of classes

y_train = to_categorical(y_train, num_classes=num_classes)
y_test = to_categorical(y_test, num_classes=num_classes)

# Reshape y_train to have 2 dimensions if necessary
y_train = y_train.reshape(-1, num_classes)

print(f"y_train shape: {y_train.shape}")
print(f"y_test shape: {y_test.shape}")

min_samples = min(len(X_train), len(y_train))
X_train = X_train[:min_samples]
y_train = y_train[:min_samples]
X_train = X_train[:len(y_train)]

import numpy as np

# Ensure y_train is an array
y_train = np.array(y_train)

# Remove extra dimensions
y_train = np.squeeze(y_train)

# Reshape to (samples, num_classes) if needed
num_classes = y_train.shape[-1] if len(y_train.shape) > 1 else 2
y_train = y_train.reshape(-1, num_classes)

print("Fixed y_train shape:", y_train.shape)

import numpy as np

# Convert to NumPy array
y_train = np.array(y_train)

# Remove extra dimensions if any
y_train = np.squeeze(y_train)

print("Fixed y_train shape:", y_train.shape)

y_train = y_train[:len(X_train)]  # Trim y_train to match X_train
print("Trimmed y_train shape:", y_train.shape)

# Assuming X and y are your original data lists
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Perform label encoding BEFORE converting to categorical
le = preprocessing.LabelEncoder()
y_train = le.fit_transform(y_train)
y_test = le.fit_transform(y_test)

# Get the correct number of classes
num_classes = len(np.unique(np.concatenate([y_train, y_test])))

# Convert to categorical using the correct num_classes
y_train = tf.keras.utils.to_categorical(y_train, num_classes=num_classes)
y_test = tf.keras.utils.to_categorical(y_test, num_classes=num_classes)

# Convert to NumPy arrays
y_train = np.array(y_train)
X_train = np.array(X_train)
y_test = np.array(y_test)
X_test = np.array(X_test)

# Ensure X_train and y_train have the same number of samples
min_samples = min(X_train.shape[0], y_train.shape[0])  # Use shape[0] for sample count
X_train = X_train[:min_samples]
y_train = y_train[:min_samples]

print("X_train Shape: ", X_train.shape)
print("X_test Shape: ", X_test.shape)
print("y_train Shape: ", y_train.shape)
print("y_test Shape: ", y_test.shape)

# ... (rest of your code for model training) ...

# Update the num_classes in lw function if necessary:
def lw(base_model, num_classes):
    x = base_model.output  # Get the last layer output of VGG16
    x = Flatten()(x)  # Flatten the features
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(num_classes, activation='softmax')(x)  # Final output layer
    return x  # This ensures x is a KerasTensor, not a Sequential model

# Assuming `vgg` is already defined as a pretrained VGG16 model
# Make sure to use the correct num_classes here as well:
FC_Head = lw(vgg, num_classes)

# Now it correctly creates a functional model
model = Model(inputs=vgg.input, outputs=FC_Head)

print(model.summary())

from tensorflow.keras.models import Model
model.compile(optimizer='adam', loss = 'categorical_crossentropy',metrics = ['accuracy'])

history = model.fit(X_train,y_train,epochs=5,
                    validation_data=(X_test,y_test),
                    verbose = 1,
                    initial_epoch=0)

# Commented out IPython magic to ensure Python compatibility.
import matplotlib.pyplot as plt
# %matplotlib inline
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']

epochs = range(len(acc))

plt.plot(epochs, acc, 'r', label='Training accuracy')
plt.plot(epochs, val_acc, 'b', label='Validation accuracy')
plt.title('Training and validation accuracy')
plt.legend(loc=0)
plt.figure()

plt.show()

pip install opencv-python opencv-python-headless

from IPython.display import display, Javascript
from google.colab.output import eval_js
from google.colab.patches import cv2_imshow
from google.colab import files
import cv2
import numpy as np
import PIL
import io
import base64

# Function to capture an image using the camera
def take_photo(filename='photo.jpg', quality=0.8):
    js = """
    async function takePhoto() {
        const div = document.createElement('div');
        const capture = document.createElement('button');
        capture.textContent = 'Capture';
        div.appendChild(capture);
        document.body.appendChild(div);

        const video = document.createElement('video');
        video.style.display = 'block';
        document.body.appendChild(video);

        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        video.srcObject = stream;
        await video.play();

        await new Promise((resolve) => capture.onclick = resolve);

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        stream.getTracks().forEach(track => track.stop());
        video.remove();
        div.remove();

        return canvas.toDataURL('image/jpeg', %f);
    }
    """ % quality

    display(Javascript(js))
    data = eval_js("takePhoto()")

    # Convert to OpenCV format
    img_data = base64.b64decode(data.split(',')[1])
    img = np.array(PIL.Image.open(io.BytesIO(img_data)))

    # Save and return
    cv2.imwrite(filename, img)
    return filename, img

# Function to upload an image
def upload_image():
    uploaded = files.upload()
    for fn in uploaded.keys():
        img = cv2.imdecode(np.frombuffer(uploaded[fn], np.uint8), cv2.IMREAD_COLOR)
        return fn, img
    return None, None

# Prompt user to choose method
print("Choose input method:")
print("1. Upload Image")
print("2. Use Camera")

choice = input("Enter 1 or 2: ")

if choice == '1':
    photo_filename, img = upload_image()
elif choice == '2':
    photo_filename, img = take_photo()
else:
    print("Invalid choice.")
    photo_filename, img = None, None

# Display image if successfully acquired
if img is not None:
    print(f"Image saved as: {photo_filename}")
    cv2_imshow(img)
else:
    print("No image to display.")

def is_skin_disease_image(img, model):
    # Preprocess the image for your model
    img_resized = cv2.resize(img, (224, 224))  # Resize to model's input size
    img_array = np.expand_dims(img_resized, axis=0) / 255.0  # Normalize
    prediction = model.predict(img_array)

    # You can define a threshold for confidence (e.g., 0.5 or choose top class)
    predicted_class = np.argmax(prediction)
    confidence = np.max(prediction)

    if confidence > 0.6:  # Adjust as needed
        return True, predicted_class, confidence
    else:
        return False, predicted_class, confidence
if img is not None:
    # Replace 'your_model' with 'model'
    valid, predicted_class, confidence = is_skin_disease_image(img, model)
    if valid:
        print(f"Detected skin disease (class {predicted_class}, confidence: {confidence:.2f})")
        cv2_imshow(img)
    else:
        print("This image does not appear to be a skin disease. Please upload a valid image.")
confirmation = input("Is this a skin disease image? (y/n): ")
if confirmation.lower() == 'y':
    cv2_imshow(img)
else:
    print("Please upload a proper skin disease image.")

def upload_image():
    uploaded = files.upload()
    for fn in uploaded.keys():
        if not fn.lower().endswith(('.jpg', '.jpeg', '.png')):
            print(f"Unsupported file format: {fn}. Please upload a JPG or PNG image.")
            return None, None
        img = cv2.imdecode(np.frombuffer(uploaded[fn], np.uint8), cv2.IMREAD_COLOR)
        return fn, img
    return None, None

predictions = model.predict(processed_img)
class_idx = np.argmax(predictions)

import cv2
import numpy as np

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    img = img / 255.0  # Normalize
    return img

# Process image
processed_img = preprocess_image(photo_filename)

# Get predictions
predictions = model.predict(processed_img)
class_idx = np.argmax(predictions)  # Get index of highest probability
confidence = predictions[0][class_idx]  # Get confidence score

# Define class labels (Modify according to dataset)
# *** Updated class_labels to match the number of classes in the model's output (30) ***
class_labels = [
    "No Skin Disease Detected",
    "Acne",
    "Eczema",
    "Psoriasis",
    "Rosacea",
    "Melanoma",
    "Basal Cell Carcinoma",
    "Squamous Cell Carcinoma",
    "Dermatitis",
    "Urticaria (Hives)",
    # Add more labels as needed to reach 30
    "Other Skin Infection 1",
    "Other Skin Infection 2",
    "Other Skin Infection 3",
    "Other Skin Infection 4",
    "Other Skin Infection 5",
    "Other Skin Infection 6",
    "Other Skin Infection 7",
    "Other Skin Infection 8",
    "Other Skin Infection 9",
    "Other Skin Infection 10",
    "Other Skin Infection 11",
    "Other Skin Infection 12",
    "Other Skin Infection 13",
    "Other Skin Infection 14",
    "Other Skin Infection 15",
    "Other Skin Infection 16",
    "Other Skin Infection 17",
    "Other Skin Infection 18",
    "Other Skin Infection 19",
    "Other Skin Infection 20"
]

# Apply threshold
threshold = 0.75  # Adjust if needed

# Determine result
if class_idx == 0:
    result = "No Skin Disease Detected."
else:
    result = f"Skin Infection Detected: {class_labels[class_idx]}"

print(result)

import matplotlib.pyplot as plt
import cv2
import numpy as np

display_img = (processed_img[0] * 244).astype(np.uint8)


predicted_label = class_labels[class_idx] if class_idx < len(class_labels) else "Unknown"

plt.imshow(cv2.cvtColor(display_img, cv2.COLOR_BGR2RGB))
plt.axis('off')
plt.title(f"Diagnosis: {predicted_label}")
plt.show()