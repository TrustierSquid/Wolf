
import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
app.use(cookieParser())
app.use(express.json())

const posts = [
   {
      username: 'Sam',
      title: 'post1'
   },
   {
      username: 'Kyle',
      title: 'post2'
   }
]

function authenticateToken(req, res, next) {
   const authHeader = req.headers['authorization']
   const token = authHeader && authHeader.split('')[1]
   if (token == null) return res.status(401)
   
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=> {
      if (err) return res.status(403)
      req.user = user
      next()
   })
   
}

app.post('/login', (req, res) => {
   // Authenticate        
   const username = req.body.username
   const user = { name: "samuelhunt60"}
   
   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
   res.json({accessToken: accessToken})
   
})

app.get('/post', authenticateToken, (req, res)=> {

   res.json(posts.filter(post => post.username === req.user.name))
})

app.listen(8080, ()=> {
   console.log('Server is running on port 8080')
})