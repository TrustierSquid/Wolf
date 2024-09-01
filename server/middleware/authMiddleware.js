import jsonwebtoken from 'jsonwebtoken';
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GLOBAL MIDDLEWARE
// this middleware is used to check if the user is authenticated before allowing them to access certain routes
const requireAuth =  async (req, res, next)=> {
   const token = req.cookies.jwt

   // check if token exist
   if (token) {
      // jwt validation
      jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decodedToken)=> {

         // If the token doesnt match the signature
         if (err) {
            console.log('Token is not valid')
            res.redirect('/')
         } else {
            req.currentUser = decodedToken.userId
            next()
         }
      })

   } else {
      // if no token, redirect to login page
      console.log('No token found, redirecting to login')
      res.redirect('/')
   }


}


export default requireAuth;