import jwt from "jsonwebtoken"

const generateToken = async(id,email)=>{
    const accessToken = jwt.sign({
        id,
        email,
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
    

    return accessToken;
}

export default generateToken