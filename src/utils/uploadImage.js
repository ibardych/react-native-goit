import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';

const uploadImage = async image => {
  const response = await fetch(image);
  const blob = await response.blob();
  const filename = image.split('/').pop();
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  const firebaseImage = await getDownloadURL(storageRef);

  return firebaseImage;
};

export default uploadImage;
