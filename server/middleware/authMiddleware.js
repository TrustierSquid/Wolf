import jsonwebtoken from 'jsonwebtoken';

const requireAuth = (req, res, next)=> {
   const token = req.cookies.jwt

   // check if token exist
   if (token) {
      jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decodedToken)=> {
         if (err) {
            console.log('Token is not valid')
            res.redirect('/')
         } else {
            console.log('Token valid')
            next()
         }
      })
   } else {
      // ISSUE: if no token, redirect to login page
      console.log('No token, redirecting to login')
      res.redirect('/')
   }
   
}

export default requireAuth;