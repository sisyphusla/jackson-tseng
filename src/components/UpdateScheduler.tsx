// 'use client';

// import { useEffect, useRef } from 'react';

// export default function UpdateScheduler() {
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (!initialized.current) {
//       const initScheduler = async () => {
//         try {
//           const response = await fetch('/api/updateScheduler', {
//             method: 'POST',
//           });
//           const data = await response.json();
//           console.log(data.message);
//         } catch (error) {
//           console.error('Failed to initialize scheduler:', error);
//         }
//       };

//       initScheduler();
//       initialized.current = true;
//     }
//   }, []);

//   return null;
// }
