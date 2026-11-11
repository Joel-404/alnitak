import {Router} from 'express'
const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        status:"ok", 
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    
     })
     if(!res.status(200)){
        res.status(500).json({
            status:"error",
            message: "Internal Server Error"
        })
     }
    });
    export default router
   
