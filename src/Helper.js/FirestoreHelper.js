import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';

/**
 * Firestore findOne
 * @param {string} collectionName
 * @param {object} props
 * @param {string} props.key
 * @param {('<'| '<=' | '==' | '>' | '>=' | '!=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in')} props.comparation
 * @param {string} props.value
 */
export const findOne = async (collectionName, props) => {
  const getData = await firestore()
    .collection(collectionName)
    .where(props.key, props.comparation, props.value)
    .get();
  if (getData.size === 1) return getData.docs[0].data();
  else return false;
};

export const update = async (collectionName, documentID, value) => {
  return await firestore()
    .collection(collectionName)
    .doc(documentID)
    .update(value);
};

export const addAbsen = (documentID, value) => {
  return firestore()
    .collection('Absen')
    .doc('List')
    .collection(dayjs().format('DD-MM-YYYY'))
    .doc(documentID)
    .set(value);
};

export const isUserAlreadyAttandance = async uid => {
  const isExist = await firestore()
    .collection('Absen')
    .doc('List')
    .collection(dayjs().format('DD-MM-YYYY'))
    .doc(uid)
    .get();
  return isExist.exists;
};

export const FirestoreTimestamp = firestore.FieldValue.serverTimestamp();
