import { loginService, registerService } from "../services/auth.service.js";

const registerController = async(req, res) => {
    const {email, password, username, rolesRequested} = req.body;

    try{
        const data = await registerService(email, password, username, rolesRequested)

        if(!data.success){
            return res.status(401).json({success: false, message: data.message})
        }

        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(201).json(data)
    }catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}

const loginController = async(req, res) => {
    const {email, password} = req.body;

    try{
        const data = await loginService(email, password)

        if(!data.success){
            return res.status(401).json({success: false, message: data.message})
        }

        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(200).json(data)
    }catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}

const logoutController = async(_, res) => {
    try{
        res.clearCookie("accessToken")
        return res.status(200).json({success: true, message: "User logged out successfully"})
    }catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}

export {registerController, loginController, logoutController}
    