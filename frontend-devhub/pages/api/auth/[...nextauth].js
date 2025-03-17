import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { signIn } from "next-auth/react";
import { db, doc, getDoc, setDoc }  from "@/utils/firebase";
import { updateDoc } from "firebase/firestore";

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
        const userRef = doc(db, "users", user.email);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
            createdAt: new Date(),
            lastLogin: new Date(),
          }); //save new user
        } else {
          await updateDoc(userRef, {
            lastLogin: new Date() //update last login
          });
        }
        return true;
      } catch (error) {
        console.error("Error saving user: ", error);
        return false;
      }
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role; //role from JWT
      return session;
    },
    async jwt({ token, user }) {
      if(user) {
        const userRef = doc(db, "users", user.email);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          token.role = userSnap.data().role || "user"; // user is default role
        }
      }
      return token;
    }
    
  },
};

export default NextAuth(authOptions);
