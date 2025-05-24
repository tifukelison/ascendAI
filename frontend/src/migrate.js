import { db } from './firebase.js'; // Adjust import path
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const migrateLessons = async () => {
  try {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    for (const courseDoc of coursesSnapshot.docs) {
      const courseData = courseDoc.data();
      if (courseData.lessons && !Array.isArray(courseData.lessons)) {
        const lessonIds = Object.values(courseData.lessons)
          .map((lesson) => {
            if (lesson && lesson.path) {
              return lesson.path.split('/')[1]; // Extract lessonId from DocumentReference
            }
            return null;
          })
          .filter((id) => id);
        await updateDoc(doc(db, 'courses', courseDoc.id), { lessons: lessonIds });
        console.log(`Updated course ${courseDoc.id}`);
      }
    }
    console.log('Migration completed');
  } catch (err) {
    console.error('Migration failed:', err);
  }
};

migrateLessons();