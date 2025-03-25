import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { signIn } from "next-auth/react";
import { db, doc, getDoc, setDoc, auth }  from "../../../utils/firebase";
import { updateDoc, query, where, collection, getDocs } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        const usersCollection = collection(db, 'users');

         // try to find the user by email to avoid duplicate accounts
        const q = query(usersCollection, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        let userId;


        if (!querySnapshot.empty) {
          const existingUser = querySnapshot.docs[0];
          userId = existingUser.id; // Asignar el ID existente
          console.log("User already exists:", existingUser.data());
        } else {
          
          // Create a new user with UUID
          const userCred = await createUserWithEmailAndPassword(auth, user.email, user.email);
          const userRef = doc(usersCollection, userCred.user.uid);
          await setDoc(userRef, {
            id: userCred.user.uid,
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
            createdAt: new Date(),
            lastLogin: new Date(),
          });

          // await fetch('http://localhost:3001/users', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     Authorization: `Bearer ${idToken}`,
          //   },
          //   body: JSON.stringify(userData),
          // });
        }

        return true;
      } catch (error) {
        console.error("Error saving user: ", error);
        return false;
      }
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }){
      if(user) {
        const usersCollection = collection(db, 'users');

        const q = query(usersCollection, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if(!querySnapshot.empty) {
          const existingUser = querySnapshot.docs[0];
          token.id = existingUser.id;
          token.role = existingUser.data().role || "user";
        }
      }
      return token;
    }
  },
};

export default NextAuth(authOptions);
