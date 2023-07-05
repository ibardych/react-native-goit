import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const countEntries = async params => {
  try {
    const collectionRef = collection(db, params.collection);
    const q = query(collectionRef, where(params.by, '==', params.query));

    const querySnapshot = await getDocs(q);
    const numberOfEntries = querySnapshot.size;

    return numberOfEntries;
  } catch {
    error => console.log(error.message);
    return 0;
  }
};

export default countEntries;
