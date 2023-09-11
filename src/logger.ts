import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore/lite';


export class Logger {

    user; app; db; log_target;

    constructor(userid: string)
    {
        this.user = userid;
        const firebaseConfig = {
            // Add your firebase config here
            authDomain: "fill.firebaseapp.com",
            databaseURL: "fill.firebaseio.com",
            projectId: "fill",
            storageBucket: "fill",
          };
    
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app)
        this.log_target = collection(this.db, 'gpt-queries');
    }
 
    payload(payload: any, response: string, loglevel: string)
    {
        return {
            user: this.user,
            query: payload,
            response: response,
            timestamp: Date.now(),
            loglevel: loglevel
        }
    }

    async info(payload: any, response: string)
    {
        let p = this.payload(payload, response, "info");

        let log = doc(this.log_target);
        await setDoc(log, p);
    }
  }

