import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";


export const loader = async ({request})=>{
   try {
    const {amdin, session} =  await authenticate.admin(request)
    
   } catch (error) {
    
   } 
} 